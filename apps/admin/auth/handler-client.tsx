'use client';

import z from 'zod';
import React from 'react';
import bcrypt from 'bcryptjs';
import { Alert } from '@repo/ui/alert';
import { useSession } from 'next-auth/react';
import { DefaultValues, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInSchema, SignUpSchema } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues } from 'react-hook-form';
import { signup } from '@/auth/signup';
import { signin } from '@/auth/signin';
import { User } from '@/types/user';
import { toast } from 'sonner';
import { FluentLinkMultipleColorIcon, FluentWarningColorIcon } from '@/components/icons';

// import { initialValues } from '@repo/components';
// import { GenerateInvitationTokenSchema, RegisterUserWithTokenSchema } from '@/schemas/invitation-token';
// import { getTime } from '@repo/utils';
// import { useApp } from '@/provider';
// import { ObjectId } from 'bson';
// import axios from 'axios';

type AsyncDefaultValues<TFieldValues> = (payload?: unknown) => Promise<TFieldValues>;
type OptionsFieldValues<TFieldValues> = { schema: z.ZodType<any, any, any>; defaultValues: DefaultValues<TFieldValues> | AsyncDefaultValues<TFieldValues> };

interface Session {
  session: User;
}

export function useSettingsForm<T extends FieldValues = FieldValues, TCtx = any>(session: Session['session'], options: OptionsFieldValues<T>) {
  const { schema, defaultValues } = options;
  const router = useRouter();
  const { update } = useSession();

  // const { birthday, ageString } = getFullAge(String(about?.birthDay));
  const { error, setError, success, setSuccess } = Alert.hooks();

  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isValue, setIsValue] = React.useState('');

  const form = useForm<T, TCtx>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any
  });

  return { form, router, update, error, setError, success, setSuccess, loading, setLoading, isOpen, setIsOpen, isValue, setIsValue };
}

interface StateOption {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (o: boolean) => void;
}

type SignUpFormValues = z.infer<typeof SignUpSchema>;

type SignInFormValues = z.infer<typeof SignInSchema>;

interface UseSignUpOption extends StateOption {
  emailParam?: string;
  defaultValues?: Nullable<SignUpFormValues, never, undefined>;
}
export function useSignUp(opts: UseSignUpOption = {}) {
  const { defaultOpen = false, open: openProp, onOpenChange: setOpenProp, emailParam, defaultValues = {} } = opts;
  const router = useRouter();

  const { name = '', email = '', password = '', confirmPassword = '' } = defaultValues;

  const [transition, setTransition] = React.useTransition();
  const [loading, setLoading] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);

  const [signUpResult, setSignUpResult] = React.useState<SignUpFormValues | null | undefined>(null);

  const open = openProp ?? _open;
  const setOpen = setOpenProp ?? _setOpen;

  const redirectAfterSuccess = emailParam && emailParam.trim() !== '' ? `/auth/sign-in?email=${encodeURIComponent(emailParam)}` : '/auth/sign-in';

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { name, email, password, confirmPassword }
  });

  function onSubmit({ password, ...values }: SignUpFormValues) {
    setLoading(true);

    setTransition(async () => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = { ...values, password: hashedPassword, confirmPassword: hashedPassword };

      signup(result)
        .then(data => {
          if (data.error) {
            console.log('SIGN_UP ERROR:', data.error);
            setLoading(false);
            toast.error(data.error, { description: data.desc, icon: <FluentWarningColorIcon size={26} /> });
          }
          if (data.success) {
            toast.success(data.success, emailParam ? { description: 'Halaman segera dialihkan ...', icon: <FluentLinkMultipleColorIcon /> } : undefined);
            setSignUpResult(result);
            form.reset();
            setLoading(false);
            setOpen(false);
            router.refresh();
            if (emailParam && emailParam.trim() !== '') {
              router.push(redirectAfterSuccess);
            }
          }
        })
        .catch(error => {
          setLoading(false);
          console.error('CATCH_ERROR:', error);
          toast.error('Something went wrong!', { icon: <FluentWarningColorIcon size={26} /> });
        });
    });
  }

  return { form, onSubmit, signUpResult, setSignUpResult, loading: loading || transition, setLoading, open, setOpen };
}

export function useSignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const oAuthError = searchParams.get('error') === 'OAuthAccountNotLinked';
  const chain = oAuthError ? 'error' : 'success';
  const Icon = oAuthError ? FluentWarningColorIcon : FluentLinkMultipleColorIcon;

  const catchUrl = oAuthError ? 'Email sudah digunakan' : 'Login serhasil';
  const oAuthMessage = oAuthError ? 'Gunakan email yang belum terdaftar.' : 'Selamat datang kembali, halaman segera dialihkan.';

  const [loading, setLoading] = React.useState<boolean>(false);
  const [transition, setTransition] = React.useTransition();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { identifier: '', password: '' }
  });

  async function onSubmit(values: SignInFormValues) {
    setLoading(true);

    setTransition(() => {
      signin(values, callbackUrl)
        .then(data => {
          if (data?.error) {
            console.log('SIGN_IN ERROR:', data.error);
            setLoading(false);
            toast.error(data.error, { description: data.desc, icon: <FluentWarningColorIcon size={26} /> });
          }
          if (data?.success) {
            form.reset();
            setLoading(false);
            toast.success(data.success, { icon: <FluentLinkMultipleColorIcon size={26} /> });
          }
        })
        .catch(() => {
          setLoading(false);
          toast[chain](catchUrl, { description: oAuthMessage, icon: <Icon size={26} /> });
        });
    });
  }

  return { form, onSubmit, loading: loading || transition, oAuthError };
}
