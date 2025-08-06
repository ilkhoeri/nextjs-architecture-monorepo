'use client';
import { useState, useEffect, useRef } from 'react';

export interface UseMediaQueryOptions {
  getInitialValueInEffect: boolean;
}

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void;

function attachMediaListener(query: MediaQueryList, callback: MediaQueryCallback) {
  try {
    query.addEventListener('change', callback);
    return () => query.removeEventListener('change', callback);
  } catch (e) {
    console.log(e);
    query.addListener(callback);
    return () => query.removeListener(callback);
  }
}

function getInitialValue(query: string, initialValue?: boolean) {
  if (typeof initialValue === 'boolean') {
    return initialValue;
  }

  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    return window.matchMedia(query).matches;
  }

  return false;
}

type MediaType = `(min-width: ${string})` | `(max-width: ${string})` | (string & {});

export function useMediaQuery(
  query: MediaType,
  initialValue?: boolean,
  { getInitialValueInEffect }: UseMediaQueryOptions = {
    getInitialValueInEffect: true
  }
) {
  const [matches, setMatches] = useState(getInitialValueInEffect ? initialValue : getInitialValue(query, initialValue));
  const queryRef = useRef<MediaQueryList>(null);

  useEffect(() => {
    if ('matchMedia' in window) {
      queryRef.current = window.matchMedia(query);
      setMatches(queryRef.current.matches);
      return attachMediaListener(queryRef.current, event => setMatches(event.matches));
    }

    return undefined;
  }, [query]);

  return matches;
}

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(query: number = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${query - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < query);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < query);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

const deviceQuery = {
  sm: '(min-width: 640px)',
  'max-sm': '(max-width: 639px)',
  md: '(min-width: 768px)',
  'max-md': '(max-width: 767px)',
  lg: '(min-width: 1024px)',
  'max-lg': '(max-width: 1023px)',
  xl: '(min-width: 1280px)',
  'max-xl': '(max-width: 1279px)',
  '2xl': '(min-width: 1536px)',
  'max-2xl': '(max-width: 1535px)'
};

type DeviceQuery = keyof typeof deviceQuery;

export function useDeviceQuery(query: DeviceQuery) {
  return useMediaQuery(deviceQuery[query]);
}
