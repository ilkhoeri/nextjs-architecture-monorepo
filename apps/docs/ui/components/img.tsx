'use client';
import React from 'react';
import Image from 'next/image';
import { cn } from '@repo/utils';
import { useTheme } from 'next-themes';
import { useImagePopup } from '@repo/hooks/use-image-popup';

type ExtendsImgProps = {
  popup?: boolean;
  src:
    | string
    | {
        light?: string;
        dark?: string;
        prefix?: string;
        suffix?: string;
      };
};

type ImgProps = Omit<React.ComponentProps<typeof Image>, keyof ExtendsImgProps> & ExtendsImgProps;

const SRC = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

export function Img(_props: ImgProps) {
  const { alt = '', src: srcProp, className, popup = true, ...props } = _props;
  const [mounted, setMounted] = React.useState(false);
  const theme = useTheme();

  if (popup) useImagePopup('[data-popup="true"]', { deps: [popup, theme.theme] });

  React.useEffect(() => setMounted(true), []);

  const normalizeSrc = React.useMemo(() => {
    if (typeof srcProp === 'string') return srcProp;
    const parse = (x: string) => {
      if (srcProp.prefix && srcProp.suffix) return `${srcProp.prefix}${x}${srcProp.suffix}`;
      if (srcProp.prefix) return `${srcProp.prefix}${x}`;
      if (srcProp.suffix) return `${x}${srcProp.suffix}`;
      return x;
    };
    return theme.theme === 'light' ? parse(srcProp.light ?? 'light') : parse(srcProp.dark ?? 'dark');
  }, [theme.theme, srcProp]);

  return <Image alt={alt} data-popup={popup ? 'true' : undefined} width={1000} height={500} src={!mounted ? SRC : normalizeSrc} className={cn('relative', className)} {...props} />;
}
