'use client';
import { useLocalStorage } from '@repo/hooks/use-local-storage';

type Config = {
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
};

function useStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [getStoredValue, setStoredValue] = useLocalStorage<T>({
    key,
    initialValue
  });

  return [getStoredValue!, setStoredValue] as const;
}

export function useConfig() {
  const [config, setConfig] = useStorage<Config>('config', {
    packageManager: 'pnpm'
  });

  return [config, setConfig] as const;
}
