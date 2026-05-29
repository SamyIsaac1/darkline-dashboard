import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWhatsAppUrl(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  return digits.length > 0 ? `https://wa.me/${digits}` : null
}
