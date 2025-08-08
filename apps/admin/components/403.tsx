'use client';
import * as React from 'react';
import { AccessDenied403, InternalError500, NotFound404 } from '@repo/icons/icons-illustration';
import { IconType } from '@repo/ui';
import { cn } from '@repo/utils';

type StatusErrorTrees = 'root' | 'title' | 'description' | 'svg';
type StatusErrorOption = 'NotFound' | 'internal-error' | 'denied';

interface StatusErrorObject {
  title: string;
  description: string | string[];
  icon: IconType;
}

interface StatusErrorProps extends Omit<React.ComponentProps<'div'>, 'title'>, Nullable<StatusErrorObject> {
  svgProps?: React.ComponentPropsWithRef<typeof AccessDenied403>;
  classNames?: Partial<Record<StatusErrorTrees, string>>;
  status: StatusErrorOption;
}

const statusErrorMap: Record<StatusErrorOption, StatusErrorObject> = {
  denied: {
    title: 'Permission denied',
    description: 'You do not have permission to access this page.',
    icon: AccessDenied403
  },
  'internal-error': {
    title: '500 Internal server error',
    description: 'There was an error, please try again later.',
    icon: InternalError500
  },
  NotFound: {
    title: 'Sorry, page not found!',
    description: ['Sorry, we couldn’t find the page you’re looking for.', 'Perhaps you’ve mistyped the URL? Be sure to check your spelling.'],
    icon: NotFound404
  }
} as const;

export const StatusError = React.forwardRef<HTMLDivElement, StatusErrorProps>((_props, ref) => {
  const { classNames, className, svgProps, status, children, title: titleProp, description: descriptionProp, icon: IconProp, ...props } = _props;

  const title = titleProp || statusErrorMap[status].title;
  const description = descriptionProp || statusErrorMap[status].description;
  const Icon = IconProp || statusErrorMap[status].icon;

  return (
    <div
      ref={ref}
      {...props}
      className={cn('px-4 md:px-6 mx-auto w-full flex flex-col items-center justify-center text-center font-system py-20 illustration-animated', classNames?.root, className)}
    >
      <h3 suppressHydrationWarning className={cn('text-[1.125rem] sm:text-[1.25rem] leading-normal my-0 mt-0 mb-2 font-bold', classNames?.title)}>
        {title}
      </h3>
      <p suppressHydrationWarning className={cn('text-[0.8125rem] font-normal text-muted-foreground', classNames?.description)}>
        {typeof description === 'string'
          ? description
          : description.map((list, index) => {
              return (
                <React.Fragment key={index}>
                  {list}
                  {index < description?.length - 1 && <br />}
                </React.Fragment>
              );
            })}
      </p>
      <Icon {...svgProps} suppressHydrationWarning className={cn('mt-20 mb-8', svgProps?.className, classNames?.svg)} />
      {children}
    </div>
  );
});
StatusError.displayName = 'StatusError';
