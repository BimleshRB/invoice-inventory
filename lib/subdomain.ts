/**
 * Subdomain detection utility for multi-tenant architecture.
 * Safely extracts store subdomain from hostname.
 * 
 * RESERVED SUBDOMAINS are system-owned and should NOT be treated as stores.
 */

// Must match backend ReservedSubdomains.java
const RESERVED_SUBDOMAINS = new Set([
  'api',
  'admin',
  'superadmin',
  'www',
  'dashboard',
  'auth',
  'static',
  'cdn',
  'assets',
  'status',
  'help',
  'support',
  'docs',
  'blog',
  'app',
  'portal',
  'console',
  'staging',
  'dev',
  'test',
  'demo',
  'secure',
  'vpn',
  'mail',
  'smtp',
  'ftp',
  'ssh',
  'localhost',
])

const BASE_DOMAIN = process.env.NEXT_PUBLIC_STORE_DOMAIN_SUFFIX || 'xyz.com' // Production domain

export interface SubdomainInfo {
  subdomain: string | null
  isReserved: boolean
  isStore: boolean
  fullHostname: string
}

/**
 * Extract subdomain from current hostname.
 * Works in browser only (uses window.location).
 * 
 * Examples:
 *   storea.xyz.com -> { subdomain: 'storea', isReserved: false, isStore: true }
 *   api.xyz.com -> { subdomain: 'api', isReserved: true, isStore: false }
 *   storea.localhost:3000 -> { subdomain: 'storea', isReserved: false, isStore: true }
 *   localhost:3000 -> { subdomain: null, isReserved: false, isStore: false }
 */
export function detectSubdomain(): SubdomainInfo {
  if (typeof window === 'undefined') {
    // Server-side: no subdomain detection
    return {
      subdomain: null,
      isReserved: false,
      isStore: false,
      fullHostname: '',
    }
  }

  const hostname = window.location.hostname
  const subdomain = extractSubdomainFromHost(hostname)

  const isReserved = subdomain ? RESERVED_SUBDOMAINS.has(subdomain) : false
  const isStore = subdomain !== null && !isReserved

  return {
    subdomain,
    isReserved,
    isStore,
    fullHostname: hostname,
  }
}

/**
 * Extract subdomain from a host string.
 * Returns null for plain localhost/IPs, or base domain.
 * Supports subdomain.localhost format (e.g., storea.localhost)
 */
function extractSubdomainFromHost(host: string): string | null {
  // Remove port if present
  if (host.includes(':')) {
    host = host.split(':')[0]
  }

  // Handle plain localhost or IP addresses
  if (host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    return null
  }

  // Handle subdomain.localhost pattern (e.g., storea.localhost)
  if (host.endsWith('.localhost')) {
    const subdomain = host.substring(0, host.length - '.localhost'.length)
    return subdomain.toLowerCase()
  }

  // Check if host contains base domain
  if (host.endsWith(`.${BASE_DOMAIN}`)) {
    // Extract subdomain: storea.xyz.com -> storea
    const subdomain = host.substring(0, host.length - BASE_DOMAIN.length - 1)

    // Handle multi-level subdomains: a.b.xyz.com -> use only first part: a
    if (subdomain.includes('.')) {
      return subdomain.split('.')[0].toLowerCase()
    }

    return subdomain.toLowerCase()
  }

  // For development: support xyz.com without subdomain (treat as null)
  if (host === BASE_DOMAIN) {
    return null
  }

  return null
}

/**
 * Check if a subdomain is reserved (system-owned).
 */
export function isReservedSubdomain(subdomain: string | null): boolean {
  if (!subdomain) return false
  return RESERVED_SUBDOMAINS.has(subdomain.toLowerCase())
}

/**
 * Get the X-Store-Host header value for API requests.
 * Returns the full hostname for store contexts, null otherwise.
 */
export function getStoreHostHeader(): string | null {
  const info = detectSubdomain()
  
  // Only send header for valid store subdomains (not reserved, not null)
  if (info.isStore && info.subdomain) {
    return info.fullHostname
  }
  
  return null
}

/**
 * Check if current context should allow store-related API calls.
 * Returns false for reserved subdomains and non-store contexts.
 */
export function canAccessStoreAPIs(): boolean {
  const info = detectSubdomain()
  return info.isStore
}
