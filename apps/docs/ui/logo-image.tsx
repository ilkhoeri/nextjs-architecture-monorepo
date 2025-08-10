'use client';
import React from 'react';
import Image from 'next/image';

type LogoImageProp = Omit<React.ComponentProps<typeof Image>, 'alt' | 'src' | 'height' | 'width'> & {
  size?: number | `${number}`;
};

export function LogoImage({ size = 46, onContextMenu, style, ...props }: LogoImageProp) {
  return (
    <Image
      {...props}
      height={size}
      width={size}
      alt="logo"
      src="/contentlayer-310x310.png"
      style={
        {
          ...style,
          WebkitUserDrag: 'none'
        } as React.CSSProperties
      }
      onContextMenu={e => {
        e.preventDefault();
        onContextMenu?.(e);
      }}
    />
  );
}
