import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWhatsAppUrl(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  return digits.length > 0 ? `https://wa.me/${digits}` : null
}

export function formatFileSize(bytes: number | null | undefined): string | null {
  if (bytes == null || bytes <= 0) return null

  const units = ['B', 'KB', 'MB', 'GB'] as const
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  const decimals = unitIndex === 0 ? 0 : size < 10 ? 1 : 0
  return `${size.toFixed(decimals)} ${units[unitIndex]}`
}
