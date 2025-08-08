'use client';
import React from 'react';
import { cn } from '@repo/utils/cn';
import { motion } from 'framer-motion';
import { useSignUp } from '@/auth/handler-client';
import { Form } from '@repo/components/fields';
import { containerVariants } from '@repo/components/motion';
import { RequirementPassword, requirements } from '@repo/components/fields';
import { LoaderAuthPage, AuthButtonSubmit, styleForm, HeadImageSign } from './components';
import { Separator } from '@repo/ui/separator';

const classes = styleForm().auth();

interface SignUpFormProps extends React.ComponentPropsWithoutRef<'form'> {
  providerSign?: React.ReactNode;
}

export function RegisterForm({ className, providerSign, ...props }: SignUpFormProps) {
  const [viewPsw, setViewPsw] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const { form, onSubmit, loading } = useSignUp({
    emailParam: email
  });

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) setEmail(emailParam);
  }, []);

  return (
    <Form.Provider {...form}>
      <LoaderAuthPage loading={loading} />

      <HeadImageSign title="Create your account" description="Welcome! Please fill in the details to get started." size={48} className={cn(!providerSign && 'mb-6')} />

      {providerSign}
      {providerSign && <Separator label="or" className="-my-2" />}

      <Form {...props} onSubmit={form.handleSubmit(onSubmit)} className={cn('group flex flex-col gap-6 w-full min-h-max', className)}>
        <div className="grid gap-4">
          <Form.Field
            control={form.control}
            name="name"
            render={({ field }) => <Form.InputField label="Name" placeholder="Name" errorMessage="placeholder" disabled={loading} classNames={classes.focused()} {...field} />}
          />

          <Form.Field
            control={form.control}
            name="email"
            render={({ field }) => (
              <Form.InputField
                disabled={loading}
                label="Email address"
                placeholder="Enter your email address"
                errorMessage="placeholder"
                classNames={classes.focused()}
                {...field}
                onChange={e => {
                  const result = e.target.value.replace(/[^a-zA-Z0-9@_.-]/g, '');
                  field.onChange(result);
                  setEmail(result);
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
                label="Password"
                placeholder="Enter Password"
                classNames={classes.focused()}
                disabled={loading}
                {...field}
                open={viewPsw}
                onOpenChange={setViewPsw}
                errorMessage="placeholder"
              />
            )}
          />

          <Form.Field
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <Form.InputPasswordField
                id="confirmPassword"
                label="Confirm Password"
                autoComplete="off"
                disabled={loading}
                placeholder="Confirm your password"
                errorMessage="placeholder"
                classNames={classes.focused()}
                {...field}
                open={viewPsw}
                onOpenChange={setViewPsw}
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

        <AuthButtonSubmit label="Register" loading={loading} className="-mt-4 mb-2" />
      </Form>
    </Form.Provider>
  );
}
