import { format } from 'date-fns';

/** Formate une date en `yyyy/MM/dd, hh:mm:ss aa`. */
export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'yyyy/MM/dd, hh:mm:ss aa');
}
