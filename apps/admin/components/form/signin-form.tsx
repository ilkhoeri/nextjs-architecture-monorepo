'use client';
import React from 'react';
import Link from 'next/link';
import { cn } from '@repo/utils/cn';
import { motion } from 'framer-motion';
import { siteConfig } from '@/app/config/site';
import { Separator } from '@repo/ui/separator';
import { useSignIn } from '@/auth/handler-client';
import { Form } from '@repo/components/fields';
import { containerVariants } from '@repo/components/motion';
import { RequirementPassword, requirements } from '@repo/components/fields';
import { AuthButtonSubmit, HeadImageSign, LoaderAuthPage, styleForm } from './components';

const classes = styleForm().auth();

interface SignInFormProps extends React.ComponentPropsWithoutRef<'form'> {
  providerSign?: React.ReactNode;
}

export function SignInForm({ className, providerSign, ...props }: SignInFormProps) {
  const [email, setEmail] = React.useState('');

  const { form, loading, onSubmit, oAuthError } = useSignIn();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');

    if (emailParam) {
      setEmail(emailParam);
      form.setValue('identifier', emailParam);
    }
  }, [form]);

  const oAuthMessage = oAuthError ? 'Email Anda sudah terdaftar di provider lain.\nSilakan masuk dengan penyedia yang sama.' : 'Selamat datang kembali! Silakan masuk untuk melanjutkan.';

  return (
    <Form.Provider {...form}>
      <LoaderAuthPage loading={loading} />

      <HeadImageSign
        title={'Sign in ' + (oAuthError ? 'Error' : `to ${siteConfig().name}`)}
        description={oAuthMessage}
        size={48}
        classNames={{
          root: cn(!providerSign && 'mb-6'),
          title: cn(oAuthError && 'text-red-600'),
          description: cn(oAuthError && 'text-red-500/50 whitespace-pre-wrap w-full')
        }}
      />

      {providerSign}
      {providerSign && <Separator label="or" className="-my-2" />}

      <Form {...props} onSubmit={form.handleSubmit(onSubmit)} className={cn('group flex flex-col gap-6 w-full', className)}>
        <div className="grid gap-4">
          <Form.Field
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <Form.InputField
                autoComplete="off"
                label="Email address or username"
                placeholder="Enter Email or Username"
                disabled={loading}
                errorMessage="placeholder"
                classNames={classes.focused()}
                {...field}
                value={field.value || email}
                onChange={e => {
                  field.onChange(e);
                  setEmail(e.target.value);
                }}
              />
            )}
          />

          <Form.Field
            control={form.control}
            name="password"
            render={({ field }) => (
              <Form.InputPasswordField
                autoComplete="off"
                label="Enter Password"
                placeholder="Enter Password"
                disabled={loading}
                classNames={classes.focused()}
                errorMessage="placeholder"
                {...field}
              />
            )}
          />

          <Form.Field
            control={form.control}
            name="password"
            render={({ field }) => {
              const meets = !!field.value && !requirements().every(i => i.rg.test(field.value));
              return (
                <motion.div
                  initial={false}
                  animate={meets ? 'open' : 'closed'}
                  variants={containerVariants()}
                  className="overflow-hidden !-mt-2 *:text-xs *:text-start flex flex-col items-start"
                >
                  <span className="font-normal mb-1 text-muted-foreground">Make sure the following requirements are met:</span>
                  <RequirementPassword
                    value={field.value}
                    classNames={{
                      root: 'ml-1.5 rtl:ml-0 rtl:mr-1.5',
                      item: 'text-xs text-muted data-[state=pass]:text-green-600 data-[state=pass]:line-through'
                    }}
                  />
                </motion.div>
              );
            }}
          />
        </div>

        <AuthButtonSubmit label="Login" loading={loading} className="-mt-4" />

        <Link
          aria-disabled={loading}
          tabIndex={-1}
          href="#"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mx-auto text-tiny transition-colors font-medium underline-hover hover:text-gradient aria-disabled:opacity-50"
        >
          Reset Password
        </Link>
      </Form>
    </Form.Provider>
  );
}
