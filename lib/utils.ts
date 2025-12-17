import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  formatCurrency,
  formatCurrencyShort,
  formatNumber,
  setLocale,
  setCurrency,
  getLocale,
  getCurrency,
} from "./i18n"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export locale helpers for backward compatibility
export { formatCurrency, formatCurrencyShort, formatNumber, setLocale, setCurrency, getLocale, getCurrency }
