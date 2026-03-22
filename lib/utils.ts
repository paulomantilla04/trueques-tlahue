import { type ClassValue, clsx } from 'clsx'

// Merge Tailwind classes safely (install clsx: npm install clsx)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return 'A convenir'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}