import { twMerge } from 'tailwind-merge';
import { cnx, cnxValues } from 'xuxi';

export function cn(...args: cnxValues[]) {
  return twMerge(cnx(...args));
}
