'use client';
import React from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { User } from '@/types/user';
import { Button } from '@repo/ui/button';
import { updateAccount } from '@/auth/handler-server';
import { useSettingsForm } from '@/auth/handler-client';
import { Form, FormInputFieldProps } from '@repo/components/fields/form';
import { containerVariants, itemVariants } from '@repo/components/motion';
import { createField, createFields, Field, renderFormField } from '@repo/components/fields/utils';
import { SettingGeneralFormValues, SettingGeneralSchema } from '@/schemas/user';
import { formatBirthDay, getAge } from '@repo/utils/age-generated';
import { getFromUser } from '@/lib/const/get-from-user';
import { getHoroscopeSign } from '@repo/utils/horoscope';
import { TextTransform } from '@repo/utils/text-parser';
import { SettingAvatarForm } from './avatar-form';
import { getShioEntry } from '@repo/utils/shio';
import { PencilIcon } from '@repo/icons';
import { styleForm } from './components';
import { cn } from '@repo/utils/cn';
import { cvx, ocx } from 'xuxi';

const classes = styleForm().account();

const classesSelector = cvx({
  assign: cn(
    classes.className,
    "[&>input]:transition-all after:content-[var(--content)] after:absolute after:right-4 after:text-[13px] [&>input]:has-[input[data-field='valid']]:!pr-[var(--inset-end)]"
  ),
  variants: {
    name: {
      height: "has-[input[data-field='valid']]:[--content:'_cm'] [--inset-end:2.5rem]",
      weight: "has-[input[data-field='valid']]:[--content:'_kg'] [--inset-end:2.25rem]"
    }
  }
});

function sameInputFields<TPath extends string, TName extends string>(
  path: TPath,
  names: TName[],
  { readOnly = false } = {}
): Field<'input', `${TPath}.${TName}`, FormInputFieldProps<`${TPath}.${TName}`>>[] {
  const transform = new TextTransform();
  return names.map(name => {
    return createField('input', {
      readOnly,
      name: `${path}.${name}` as `${TPath}.${TName}`,
      type: readOnly ? 'text' : 'number',
      label: transform.initial(`${name}:`),
      placeholder: readOnly ? '--' : `Add ${name}`,
      ...(readOnly
        ? classes
        : {
            invalidValues: { string: ['0'], number: [0] },
            className: classesSelector({ name: name as any }),
            classNames: classes.classNames
          })
    });
  });
}

export function SettingAboutForm({ user }: { user: User }) {
  const defaultValues = Form.initialValues(user, {
    string: ['name', 'about.birthPlace', 'about.bio', 'about.resume', 'about.nationalId', 'about.taxId'],
    undefined: ['about.birthDay', 'about.gender'],
    array: ['about.notes'],
    number: [],
    date: []
  });

  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [openCalendar, setOpenCalendar] = React.useState<boolean>(false);

  const { form, router, loading, setLoading } = useSettingsForm<SettingGeneralFormValues>(user, {
    schema: SettingGeneralSchema,
    defaultValues
  });

  if (!user) return null;

  const formFields = [
    createField('input', { name: 'name', label: 'Display name:', placeholder: 'Enter name', errorMessage: 'placeholder', autoComplete: 'off', ...classes }),
    createField('select-item', {
      name: 'about.gender',
      label: 'Gender:',
      placeholder: 'Select Gender',
      errorMessage: 'placeholder',
      withReset: null,
      withSearch: false,
      data: ['Male', 'Female'],
      ...classes
    }),
    createField('date', {
      name: 'about.birthDay',
      open: openCalendar,
      onOpenChange: setOpenCalendar,
      type: 'single',
      label: 'Birthday:',
      openWith: 'drawer',
      onChange: (date: any) => {
        setOpenCalendar(false);
      },
      placeholder: 'DD MM YYYY',
      className: classes.className,
      classNames: {
        content: '[&>.rdp]:w-full [&>.rdp]:min-w-[366px] [&>.rdp]:max-w-[478px] [&>.rdp]:p-0 [&>.rdp]:mx-auto flex flex-col items-center justify-start',
        ...classes.classNames
      }
    }),
    ...sameInputFields('about', ['horoscope', 'zodiac'], { readOnly: true }),
    ...sameInputFields('about', ['height', 'weight'])
  ];

  const formFields2 = createFields([...sameInputFields('about', ['horoscope', 'zodiac'], { readOnly: true }), ...sameInputFields('about', ['height', 'weight'])] as const);

  function onSubmit({ name, about }: SettingGeneralFormValues) {
    setLoading(true);
    try {
      toast.promise(
        updateAccount(user?.id, {
          name: name ? getFromUser().name(name) : name,
          about: {
            upsert: {
              create: about,
              update: about
            }
          }
        }),
        {
          loading: 'Updating...',
          success: () => {
            router.refresh();
            setLoading(false);
            setTimeout(() => setIsEdit(false), 300);
            return 'Your information has been updated';
          },
          error: 'There is an error'
        }
      );
    } catch (error) {
      toast.error('Error');
    } finally {
      router.refresh();
      setLoading(false);
    }
  }

  const disabled = loading || !isEdit;

  return (
    <Form.Card>
      <div className="inline-flex flex-row items-center justify-between">
        <h3 className="font-bold text-sm">About</h3>
        <Button
          type={isEdit ? 'submit' : 'button'}
          form={isEdit ? 'about-section-form' : undefined}
          disabled={loading}
          onClick={() => {
            if (!isEdit) setTimeout(() => setIsEdit(true), 35);
          }}
          className={cn('w-max text-xs font-medium text-gradient')}
        >
          {isEdit ? 'Save & Update' : <PencilIcon size={18} />}
        </Button>
      </div>

      {/* Static text when not editing */}
      <motion.div initial={false} animate={!isEdit ? 'open' : 'closed'} variants={containerVariants()} className="overflow-hidden">
        <AboutSectionFallback user={user} />
      </motion.div>

      <motion.div initial={false} animate={isEdit ? 'open' : 'closed'} variants={containerVariants()}>
        <motion.div variants={itemVariants()}>
          <SettingAvatarForm account={user} />
        </motion.div>
        <Form.Provider {...form}>
          <Form
            id={isEdit ? 'about-section-form' : undefined}
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn('my-2 grid grid-cols-1 lg:grid-cols-2 gap-3', !isEdit && '[&_*]:*:!pointer-events-none')}
          >
            {formFields.map(field => (
              <motion.div key={field.name} variants={itemVariants()}>
                {renderFormField(form.control, field, disabled)}
              </motion.div>
            ))}

            <Button
              type="button"
              disabled={disabled}
              onClick={() => {
                if (isEdit && !loading) setTimeout(() => setIsEdit(false), 35);
              }}
              className={cn('w-max text-xs font-medium text-gradient ml-auto')}
            >
              Cancel
            </Button>
          </Form>
        </Form.Provider>
      </motion.div>
    </Form.Card>
  );
}

interface AboutSectionFallbackProps {
  user: User;
}
function AboutSectionFallback({ user }: AboutSectionFallbackProps) {
  if (!user) return null;

  const filter = <T,>(i: T) => i !== null && i !== undefined && i !== 0 && i !== '0';

  const formatted = formatBirthDay(user.about?.birthDay);

  const aboutInfo = ocx({
    Birthday: filter(user.about?.birthDay) && `${formatted} (Age ${getAge(user.about?.birthDay).yearDiff})`,
    Horoscope: filter(user.about?.birthDay) && getHoroscopeSign(user.about?.birthDay),
    Zodiac: filter(user.about?.birthDay) && getShioEntry(user.about?.birthDay)?.animal
  });

  const displayInfo = Object.entries(aboutInfo)
    .filter(([_, value]) => {
      return filter(value);
    })
    .map(([label, value]) => ({
      label,
      value: String(value)
    }));

  if (!user.about || !displayInfo || displayInfo.length === 0) {
    return <p className="text-sm font-medium text-muted-foreground ">Add in your profile to help others know you better</p>;
  }

  return (
    <div className="grid grid-flow-row gap-3">
      {displayInfo.map(({ label, value }) => (
        <div key={label} className="flex flex-row items-center gap-1 font-medium text-color text-[13px]">
          <span className="text-[#565757] dark:text-[#5d6367]">{label}:</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
