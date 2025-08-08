import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@repo/utils/cn';
import { Loader } from '@repo/ui/loader';
import { Button } from '@repo/ui/button';
import { classesInput } from '@repo/ui/input';
import { Portal } from '@repo/hooks/use-open-state';

interface Options {
  className?: string;
}

export function styleForm() {
  return {
    auth() {
      return {
        focused() {
          return {
            label: 'cursor-default text-color font-medium',
            input: classesInput()
          };
        },
        item(opt: Options = {}) {
          return cn('transition-all duration-300 has-[input:placeholder-shown]:opacity-50 group-focus-within:opacity-100', opt.className);
        },
        submit(opt: Options = {}) {
          return cn(
            "flex flex-row items-center justify-center gap-2 w-full bg-gradient-button transition-[transform,opacity,height] duration-500 group-focus-within:opacity-100 group-has-[input[value='']]:h-0 group-has-[input[value='']]:opacity-25 group-has-[input[value='']]:pointer-events-none overflow-hidden",
            opt.className
          );
        }
      };
    },
    account() {
      return {
        className: 'flex flex-row items-center justify-between space-y-0',
        classNames: {
          label: 'text-[13px] font-medium text-[#00000099] dark:text-[#ffffff54]',
          input:
            'border [--color:#0000008c] dark:[--color:#ffffff4d] text-color dark:border-[#00000038] dark:border-[#ffffff38] text-right text-[13px] placeholder:text-[13px] dark:placeholder:text-[var(--color)] w-full max-w-[65%] *:text-[13px] *:text-[var(--color)] [&_span]:ml-auto [&_span]:aria-selected:text-color [&:where(input:read-only)]:cursor-default [&:where(input:read-only)]:text-[var(--color)] [&:where(input:read-only)]:focus-visible:border-[#ffffff38]'
        }
      };
    }
  };
}

interface ButtonSubmitProps extends React.ComponentPropsWithRef<typeof Button> {
  label: string;
  loading?: boolean;
  isValid?: boolean;
}
export function AuthButtonSubmit(_props: ButtonSubmitProps) {
  const { label, className, loading, disabled, isValid, ...props } = _props;
  return (
    <Button {...props} type="submit" size="sm" disabled={disabled || loading} data-isvalid={isValid ? 'true' : 'false'} className={styleForm().auth().submit({ className })}>
      {loading && <Loader type="spinner" size={17.5} color="white" />}
      <span className="text-white relative z-[3]">{label}</span>
      <span className="backdrop-gradient transition-[transform,opacity] duration-500 group-focus-within:opacity-100 group-has-[input[value='']]:opacity-0 group-has-[input[value='']]:[transform:translate(-50%,-50%)]" />
    </Button>
  );
}

interface DirectLinkProps extends React.ComponentPropsWithRef<typeof Link> {
  label: string[];
  disabled?: boolean;
}
export function DirectLink(_props: DirectLinkProps) {
  const { label, disabled, href, className, ...props } = _props;
  return (
    <div {...{ 'aria-disabled': disabled }} className={cn('mt-4 text-center text-[13px] font-medium flex items-center justify-center gap-1 aria-disabled:opacity-50', className)}>
      <span className="text-white">{label[0]}</span>
      <Link {...props} aria-disabled={disabled} tabIndex={-1} href={href} className="underline-hover text-gradient">
        {label[1]}
      </Link>
    </div>
  );
}

interface HeadImageSignProps extends React.ComponentPropsWithRef<'div'> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  size?: number | `${number}`;
  classNames?: Partial<Record<'root' | 'icon' | 'title' | 'description', string>>;
}
export function HeadImageSign(_props: HeadImageSignProps) {
  const { icon = '/icons/logo.png', size = 120, title, description, className, classNames, ...props } = _props;
  const parseIcon = typeof icon === 'string' ? <Image alt="" height={size} width={size} src={icon} className={cn('mb-4 rounded-lg', classNames?.icon)} /> : icon;

  return (
    <div {...props} className={cn('flex w-full flex-col items-center gap-1 text-center', classNames?.root, className)}>
      {icon && parseIcon}
      {title && <h1 className={cn('text-[1.0625rem] font-bold', classNames?.title)}>{title}</h1>}
      {description && <p className={cn('text-balance [text-wrap-style:stable] text-[.8125rem] text-muted-foreground', classNames?.description)}>{description}</p>}
    </div>
  );
}

interface LoaderAuthPageProps {
  loading?: boolean;
}
export function LoaderAuthPage(_props: LoaderAuthPageProps) {
  const { loading } = _props;
  if (!loading) return null;
  return (
    <Portal render={loading}>
      <div
        data-overlay-auth=""
        className="fixed size-full centered bg-[linear-gradient(108.32deg,#62cdcb0a_24.88%,#4599db0a_78.49%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[120]"
      >
        {/* <Loader type="spinner" size="22px" /> */}
      </div>
    </Portal>
  );
}
