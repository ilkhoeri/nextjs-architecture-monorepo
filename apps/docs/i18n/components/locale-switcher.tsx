'use client';

import * as React from 'react';
import { cn } from '@repo/utils';
import { i18nLocale } from '../types';
import { Sheets } from '@/ui/sheets';
import { RadioGroup, RadioItem, radioVariants } from './radio';
// import { StandaloneRadioGroup as RadioGroup, StandaloneRadioItem as RadioItem, radioVariants } from "./radio";
import { useLocaleSwitcher } from '../hooks/use-local-switcher';
import { LocalesFlagIcon } from './icons';
import { mockLocales } from '../config';
import { LoaderSpinner } from '@repo/ui';

export function LocaleSwitcher({
  dict,
  align = 'end',
  side = 'bottom',
  className,
  classNames,
  triggerApi,
  lang
}: {
  align?: 'center' | 'end' | 'start';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  classNames?: { trigger?: string; content?: string };
  triggerApi?: {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };
} & i18nLocale) {
  const [open, setOpen] = React.useState(false);
  const { loading, currentLocale, handleChange } = useLocaleSwitcher();

  return (
    <Sheets.Dropdown open={loading ? open : undefined} onOpenChange={loading ? setOpen : undefined} align={align} side={side} sideOffset={0} clickOutsideToClose modal>
      <Sheets.Trigger unstyled disabled={loading} aria-label="Change Language" onClick={triggerApi?.onClick} className={cn(triggerApi?.className, classNames?.trigger, className)}>
        {loading ? <LoaderSpinner size={18} color="black" /> : <LocalesFlagIcon size={45} locale={lang} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
        <span className="sr-only hidden">Change Language</span>
      </Sheets.Trigger>

      <Sheets.Content className="w-56 z-99 min-w-[12.5rem] rounded-xl bg-background-theme p-2 shadow-[0_10px_32px_rgba(34,42,53,0.15),0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.08),0_1px_1px_rgba(34,42,53,0.1),0_24px_68px_rgba(47,48,55,0.1)]">
        <bdi>
          <div className={radioVariants({ role: 'title' })}>{dict?.LocaleSwitcher.label}</div>
          <div role="separator" aria-orientation="horizontal" className={radioVariants({ role: 'separator' })} />

          <RadioGroup
            value={currentLocale}
            onValueChange={value => {
              handleChange(value);
              setTimeout(() => setOpen(false), 150);
            }}
          >
            {mockLocales.map(locale => (
              <RadioItem key={locale.code} value={locale.code} checked={false}>
                <LocalesFlagIcon size={20} locale={locale.code} />
                {locale.name}
              </RadioItem>
            ))}
          </RadioGroup>
        </bdi>
      </Sheets.Content>
    </Sheets.Dropdown>
  );
}
