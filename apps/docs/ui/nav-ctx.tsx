'use client';

import React from 'react';
import { useIsMobile } from '@repo/hooks/use-media-query';
import { useModal, type UseModalOptions } from '@repo/hooks/use-modal';
import { useMobileHistoryState } from '@repo/hooks/use-mobile-history-state';

interface MediaQuery {
  mediaQuery?: number;
}

interface NavContextProps extends MediaQuery, UseModalOptions, Omit<InferType<typeof useModal>, keyof UseModalOptions> {
  isMobile: boolean | undefined;
  toggle: () => void;
}

interface NavProviderProps extends UseModalOptions, MediaQuery {
  children: React.ReactNode;
}

const NavContext = React.createContext<NavContextProps | undefined>(undefined);

export const NavProvider: React.FC<NavProviderProps> = ({ children, mediaQuery = 768, ...rest }) => {
  const state = useModal({ ...rest });
  const { open, setOpen } = state;
  const isMobile = useIsMobile(mediaQuery);
  useMobileHistoryState(isMobile, { open: open, onOpenChange: setOpen });

  React.useEffect(() => {
    const body = document.body;

    if (open && isMobile) {
      body.style.setProperty('overflow', 'hidden');
    } else {
      body.style.removeProperty('overflow');
    }

    return () => {
      if (open && isMobile) {
        body.style.removeProperty('overflow');
      }
    };
  }, [open, isMobile]);

  const toggle = React.useCallback(() => {
    setOpen(o => !o);
  }, [open]);

  return (
    <NavContext.Provider
      value={{
        mediaQuery,
        isMobile,
        toggle,
        ...state
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const useNavContext = () => {
  const context = React.useContext(NavContext);
  if (!context) {
    throw new Error('useNavContext must be used within an NavProvider');
  }
  return context;
};
