'use client';
import { useCallback, useEffect, useState } from 'react';
import { useMeasureScrollbar } from './use-measure-scrollbar';

type ExpandedState = string | boolean | string[] | null;
type ExpandedOptions = {
  multiple?: boolean | undefined;
};

export interface UseOpenOptions {
  modal?: boolean;
  open?: ExpandedState;
  defaultOpen?: boolean;
  /** @default 300 */
  exitDuration?: number;
  onOpenChange?: (prev: ExpandedState | ((prev: ExpandedState) => ExpandedState)) => void;
}

export function useOpenState(opts: UseOpenOptions = {}) {
  const { defaultOpen = false, open: openProp, onOpenChange: setOpenProp, modal, exitDuration = 300 } = opts;

  const [openState, setOpenState] = useState<ExpandedState>(defaultOpen);

  const _expanded = openProp ?? openState;
  const _setExpanded = setOpenProp ?? setOpenState;

  const open = useCallback(
    (target?: string) => {
      if (typeof _expanded === 'boolean') {
        return _expanded;
      }
      if (typeof _expanded === 'string') {
        return _expanded === target;
      }
      if (Array.isArray(_expanded) && target) {
        return _expanded.includes(target);
      }
      return false;
    },
    [_expanded]
  );

  const setOpen = useCallback(
    (value: string | null | boolean = !_expanded, opts: ExpandedOptions = {}) => {
      _setExpanded(prev => {
        if (typeof value === 'boolean' || value === null) {
          return value;
        }

        if (opts?.multiple) {
          if (Array.isArray(prev)) {
            if (prev.includes(value)) {
              return prev.filter(id => id !== value);
            } else {
              return [...prev, value];
            }
          } else if (typeof prev === 'string') {
            return prev === value ? [] : [prev, value];
          } else {
            return [value];
          }
        } else {
          if (typeof value === 'string' && prev === value) {
            return null;
          }
          return value;
        }
      });
    },
    [_expanded]
  );

  const [isRender, setRender] = useState(open);

  useEffect(() => {
    if (open()) {
      setRender(true);
    } else {
      const timer = setTimeout(() => setRender(false), exitDuration);
      return () => clearTimeout(timer);
    }
  }, [open, setOpen]);

  useEffect(() => {
    if (!open()) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, setOpen]);

  useMeasureScrollbar(isRender, { modal });

  return { open, setOpen, isRender };
}
