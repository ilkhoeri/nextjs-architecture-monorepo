import * as React from 'react';
import { Loader } from './loader';
import Link, { type LinkProps } from 'next/link.js';
import { injectComponentIntoFirstChild, PolymorphicSlot } from './polymorphic-slot';
import { cvx, type cvxVariants } from 'xuxi';
import { cn } from '@repo/utils';

export type MouseEventButtonType = React.MouseEvent<HTMLButtonElement, MouseEvent>;

export type UnstyledButtonProps<Exclude extends string = never> = React.PropsWithoutRef<
  Omit<
    Omit<React.ComponentProps<'button'>, 'color' | 'style'> & {
      asChild?: boolean;
      loading?: boolean;
      color?: React.CSSProperties['color'];
      style?: React.CSSProperties & Record<string, any>;
      formAction?: any;
    },
    Exclude
  >
>;
export const UnstyledButton = React.forwardRef<HTMLButtonElement, UnstyledButtonProps>((_props, ref) => {
  const { asChild = false, type = 'button', role = 'button', children, loading, disabled, ...props } = _props;

  const Btn = asChild ? PolymorphicSlot : 'button';
  const loadingComponent = loading && <Loader size={14} />;
  const enhancedChildren = injectComponentIntoFirstChild(children, loadingComponent);

  return (
    <Btn {...{ ref, type, role, disabled: loading || disabled, ...props }}>
      {asChild ? (
        enhancedChildren
      ) : (
        <>
          {loadingComponent}
          {children}
        </>
      )}
    </Btn>
  );
});
UnstyledButton.displayName = 'UnstyledButton';

export const buttonVariants = cvx({
  assign:
    'inline-flex cursor-pointer appearance-none items-center justify-center whitespace-nowrap rounded-md text-[13px] text-[clamp(0.75rem,0.65rem+0.65vw,0.9rem)] font-medium leading-tight transition-colors duration-75 [-moz-appearance:none] [-webkit-appearance:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:gap-2 disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  variants: {
    variant: {
      constructive: 'bg-constructive text-white border-constructive focus-visible:ring-constructive/35 any-hover:hover:bg-constructive-foreground',
      conservative: 'bg-conservative text-white border-conservative focus-visible:ring-conservative/35 any-hover:hover:bg-conservative-foreground',
      primitive: 'bg-primitive text-muted-foreground border border-primitive-emphasis any-hover:hover:text-color focus-visible:ring-primitive-emphasis/35 any-hover:hover:bg-accent',
      ghost: 'focus-visible:ring-muted/35 any-hover:hover:bg-muted text-muted-foreground any-hover:hover:text-color',
      link: 'text-color py-0 px-0 underline-offset-4 active:scale-100 any-hover:hover:text-constructive any-hover:hover:underline',
      green: 'text-white font-bold bg-[#238636] hover:bg-[#2ea043] shadow',
      danger: 'text-white font-bold bg-red-600 hover:bg-red-600/80 hover:bg[#da3633] shadow',
      blue: 'text-white font-bold bg-[#0b6ec5] hover:bg-[#3b82f6] shadow',
      default: 'text-primary-foreground bg-primary hover:bg-primary/90',
      destructive: 'text-destructive-foreground bg-destructive hover:bg-destructive/90',
      outline: 'hover:bg-[#ffffff0f] border border-border focus-visible:border-ceramic-dimmed focus-visible:ring-0 focus-visible:outline-none',
      primary: 'bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      base: 'bg-background hover:bg-muted',
      'rounded-tile': 'bg-background hover:bg-muted rounded-full'
    },
    size: {
      unset: '',
      default: 'h-9 px-4 py-2',
      sm: 'h-[30px] px-3 rounded-[0.375rem]',
      md: 'h-9 px-6',
      lg: 'h-10 px-8',
      xl: 'h-12 px-8',
      '2xl': 'h-12 text-base font-semibold px-8',
      icon: '[--sz:32px] size-[var(--sz)] min-h-[var(--sz)] min-w-[var(--sz)]'
    },
    color: {
      default: '',
      base: 'text-black dark:text-white bg-[#e6e4e9] dark:bg-[#1a1a1a] any-hover:hover:bg-[#e2e2e2] dark:any-hover:hover:bg-[#202020]',
      blue: 'bg-[#228be61a] text-[#339af0] border-[#339af0] disabled:[--spinner-color:#339af0] any-hover:hover:bg-[#228be62a] any-hover:hover:text-[#3a9def]',
      grape: 'bg-[#be4bdb1a] text-[#cc5de8] border-[#cc5de8] disabled:[--spinner-color:#cc5de8] any-hover:hover:bg-[#be4bdb2a] any-hover:hover:text-[#da68f6]',
      green: 'bg-[#12b8861a] text-[#20c997] border-[#20c997] disabled:[--spinner-color:#20c997] any-hover:hover:bg-[#12b8862a] any-hover:hover:text-[#23cf9d]',
      red: 'bg-[#fa52521a] text-[#ff6b6b] border-[#ff6b6b] disabled:[--spinner-color:#ff6b6b] any-hover:hover:bg-[#fa52522a] any-hover:hover:text-[#fd7171]',
      'gradient-blue': 'bg-[linear-gradient(#0dccea,#0d70ea)] text-white disabled:[--spinner-color:white] border-[#0d70ea] any-hover:hover:bg-[linear-gradient(#0dccea,#0d70ea)]',
      'gradient-orange': 'bg-[linear-gradient(-180deg,#FF7E31,#E62C03)] text-white disabled:[--spinner-color:white] border-[#E62C03] any-hover:hover:bg-[#d4d3d5]',
      'outline-base': 'outline-2 outline outline-slate-500 bg-slate-500/20 text-slate-600 disabled:[--spinner-color:#475569] any-hover:hover:bg-slate-600/20',
      'outline-indigo': 'outline-2 outline outline-indigo-500 bg-indigo-500/20 text-indigo-600 disabled:[--spinner-color:#4f46e5] any-hover:hover:bg-indigo-600/20',
      'outline-teal': 'outline-2 outline outline-teal-500 bg-teal-500/20 text-teal-600 disabled:[--spinner-color:#0d9488] any-hover:hover:bg-teal-600/20'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
});

type Variants = cvxVariants<typeof buttonVariants> & { unstyled?: boolean };
export function buttonStyle(variants?: Variants, className?: string) {
  return cn(!variants?.unstyled && buttonVariants({ ...variants }), className);
}

export interface ButtonProps extends UnstyledButtonProps<'color'>, cvxVariants<typeof buttonVariants> {
  unstyled?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((_props, ref) => {
  const { unstyled, className, variant, color, size = 'sm', ...props } = _props;
  return <UnstyledButton {...{ ref, className: buttonStyle({ color, size, unstyled, variant }, className), ...props }} />;
});
Button.displayName = 'Button';

export interface LinkButtonProps extends Omit<LinkProps, 'href'>, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'color'>, cvxVariants<typeof buttonVariants> {
  unstyled?: boolean;
  href?: string;
  style?: React.CSSProperties & Record<string, any>;
}
export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>((_props, ref) => {
  const { unstyled, className, variant, size = 'sm', color, href = '', ...props } = _props;
  return <Link {...{ ref, href, className: buttonStyle({ color, size, unstyled, variant }, className), ...props }} />;
});
LinkButton.displayName = 'LinkButton';
