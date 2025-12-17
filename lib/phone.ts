// Basic phone utilities focused on Indian numbers without adding external deps.
// Provides normalization to E.164 and a simple validator.

export function normalizeDigits(input: string): string {
  return (input || "").replace(/[^0-9+]/g, "")
}

export function formatToE164(input: string): string | null {
  const s = normalizeDigits(input)
  if (s.startsWith("+")) {
    // Already in international format
    const digits = s.replace(/^\+/, "")
    if (digits.length >= 10 && digits.length <= 15) return `+${digits}`
    return null
  }

  // Remove leading zeros
  let digits = s.replace(/^0+/, "")

  // If starts with country code 91
  if (digits.startsWith("91") && digits.length >= 12) {
    return `+${digits}`
  }

  // If 10-digit local Indian number
  if (digits.length === 10) {
    return `+91${digits}`
  }

  // If number includes country but without + (e.g., 919876543210)
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`
  }

  return null
}

export function isValidIndianNumber(input: string): boolean {
  const e164 = formatToE164(input)
  if (!e164) return false
  // After formatting should start with +91 and have 12 digits total
  const digits = e164.replace(/^\+/, "")
  return digits.length === 12 && digits.startsWith("91")
}
