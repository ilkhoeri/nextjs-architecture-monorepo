'use client';
import React from 'react';
import { cn } from '@repo/utils';
import { CheckIcon } from '@repo/icons';
import { cvx } from 'xuxi';

export const radioVariants = cvx({
  variants: {
    role: {
      title: 'px-2 font-semibold py-0 text-base',
      separator: '-mx-1 my-1 h-px bg-muted',
      group: 'grid grid-flow-row gap-0.5',
      item: 'relative w-full flex flex-row items-center justify-start cursor-pointer bg-inherit transition-colors duration-300 hover:bg-color/5 select-none rounded-md text-sm outline-none transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 gap-3 py-2 px-3 aria-checked:bg-color/5 data-[state=checked]:bg-color/5',
      indicator:
        'bg-background-theme flex [--sz:20px] size-[var(--sz)] min-w-[var(--sz)] min-h-[var(--sz)] max-w-[var(--sz)] max-h-[var(--sz)] items-center justify-center rounded-full border border-color'
    }
  }
});

interface RadioGroupProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  name?: string;
}

interface RadioItemBaseProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface RadioItemProps extends RadioItemBaseProps {
  checked?: boolean;
  onSelect?: () => void;
  name?: string;
  id?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

/**
 * Radio Group (can be used independently)
 * @example
 * function StandaloneRadioDemo() {
 *   const [selectedOption, setSelectedOption] = useState("option1");
 *   const options = [
 *     { value: "option1", label: "Option 1", description: "This is the first option" },
 *     { value: "option2", label: "Option 2", description: "This is the second option" },
 *     { value: "option3", label: "Option 3", description: "This is the third option" }
 *   ];
 *   return (
 *     <div className="max-w-md space-y-4">
 *       <h3 className="text-lg font-semibold">Standalone Radio Group</h3>
 *       <RadioGroup value={selectedOption} onValueChange={setSelectedOption} name="demo-options">
 *         {options.map(option => (
 *           <RadioItem key={option.value} value={option.value}>
 *             <div>
 *               <div className="font-medium">{option.label}</div>
 *               <div className="text-sm text-muted-foreground">{option.description}</div>
 *             </div>
 *           </RadioItem>
 *         ))}
 *       </RadioGroup>
 *       <p className="text-sm text-muted-foreground">Selected: {selectedOption}</p>
 *     </div>
 *   );
 * }
 * @param param
 * @returns
 */
export function RadioGroup(_props: RadioGroupProps) {
  const { value, onValueChange, children, className, name } = _props;

  return (
    <div className={cn(radioVariants({ role: 'group' }), className)} role="radiogroup">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<RadioItemBaseProps>, {
            ...(child as any).props,
            checked: (child as any).props.value === value,
            onSelect: () => onValueChange((child as any).props.value),
            name
          });
        }
        return child;
      })}
    </div>
  );
}

export function RadioItem(_props: RadioItemProps) {
  const { value, children, className, disabled = false, checked, onSelect, name, id, icon, loadingIcon, loading } = _props;

  let currentIcon: React.ReactNode = null;
  if (loading && loadingIcon) currentIcon = loadingIcon;
  if (checked) currentIcon = icon ?? <CheckIcon size={13} stroke={3} />;

  const forId = id || value;
  const forName = id || name || value;

  return (
    <label
      {...{
        role: 'menuitemradio',
        htmlFor: forName,
        'aria-disabled': disabled,
        'aria-checked': checked,
        'data-disabled': disabled ? 'true' : undefined,
        'data-state': checked ? 'checked' : 'unchecked'
      }}
      className={cn(radioVariants({ role: 'item' }), className)}
    >
      <input type="radio" id={forId} name={forName} value={value as string} checked={checked} onChange={onSelect} disabled={disabled} className="sr-only" />
      <div className={cn(radioVariants({ role: 'indicator' }))}>{currentIcon}</div>
      {children}
    </label>
  );
}

// Standalone

interface StandaloneRadioGroupProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface StandaloneRadioItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * @example
 * <RadioGroup value={currentLocale} onValueChange={onLocaleChange}>
 *   {locales.map(locale => (
 *     <RadioItem key={locale.code} value={locale.code}>
 *       {locale.flag && (
 *         <svg className="h-5 w-5">
 *           <use href={`/assets/icons.svg#${locale.code}`} />
 *         </svg>
 *       )}
 *       <span>{translations?.[locale.code] || locale.name}</span>
 *     </RadioItem>
 *   ))}
 * </RadioGroup>
 * @param param0
 * @returns
 */
export function StandaloneRadioGroup({ value, onValueChange, children, className }: StandaloneRadioGroupProps) {
  return (
    <div className={cn('space-y-1', className)} role="radiogroup">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<RadioItemProps>, {
            ...(child as any).props,
            checked: (child as any).props.value === value,
            onSelect: () => onValueChange((child as any).props.value)
          });
        }
        return child;
      })}
    </div>
  );
}

export function StandaloneRadioItem({
  value,
  children,
  className,
  disabled = false,
  checked,
  loading,
  loadingIcon,
  icon,
  onSelect
}: StandaloneRadioItemProps & {
  checked?: boolean;
  onSelect?: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}) {
  let currentIcon: React.ReactNode = null;
  if (loading && loadingIcon) currentIcon = loadingIcon;
  if (checked) currentIcon = icon ?? <CheckIcon size={13} stroke={3} />;

  return (
    <button
      type="button"
      onClick={onSelect}
      // {...{ disabled, role: "radio", "aria-checked": checked }}
      // className={cn(
      //   "flex w-full items-center gap-3 rounded-sm px-2 py-2 text-sm transition-colors",
      //   "hover:bg-accent hover:text-accent-foreground",
      //   "focus:bg-accent focus:text-accent-foreground focus:outline-none",
      //   "disabled:pointer-events-none disabled:opacity-50",
      //   checked && "bg-accent text-accent-foreground",
      //   className
      // )}
      {...{
        disabled,
        role: 'radio',
        name: value,
        'aria-disabled': disabled,
        'aria-checked': checked,
        'data-disabled': disabled ? 'true' : undefined,
        'data-state': checked ? 'checked' : 'unchecked'
      }}
      className={cn(radioVariants({ role: 'item' }), className)}
    >
      <div className={cn(radioVariants({ role: 'indicator' }))}>{currentIcon}</div>
      {children}
    </button>
  );
}
