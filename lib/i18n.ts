export type SupportedCurrency = "INR" | "USD" | "EUR" | string

let currentLocale = "en-IN"
let currentCurrency: SupportedCurrency = "INR"

export function getLocale() {
  return currentLocale
}

export function getCurrency() {
  return currentCurrency
}

export function setLocale(locale: string) {
  currentLocale = locale
}

export function setCurrency(currency: SupportedCurrency) {
  currentCurrency = currency
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(currentLocale, options).format(value)
}

export function formatCurrency(amount: number, opts?: { currency?: SupportedCurrency; locale?: string }) {
  const currency = opts?.currency ?? currentCurrency
  const locale = opts?.locale ?? currentLocale

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatCurrencyShort(amount: number, opts?: { currency?: SupportedCurrency; locale?: string }) {
  const currency = (opts?.currency ?? currentCurrency) as string
  const locale = opts?.locale ?? currentLocale

  // Special compact formatting for INR using L (lakh) and Cr (crore)
  if (currency === "INR") {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(2)}K`
    }
    return formatCurrency(amount, { currency, locale })
  }

  // For other currencies use Intl compact notation where available
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 2,
    } as Intl.NumberFormatOptions).format(amount)
  } catch (e) {
    // Fallback to full currency formatting
    return formatCurrency(amount, { currency, locale })
  }
}
