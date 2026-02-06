/**
 * Authentication-based redirect utility
 * Handles subdomain redirects based on user role and store
 */

import { AuthUser } from '@/hooks/use-auth-guard'

interface UserProfile {
  storeName?: string
  storeId?: number
  storeSubdomain?: string
  role?: string
}

/**
 * Get redirect URL after successful login based on user role and store
 * Uses subdomain-based routing only in production (when NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING=true)
 * In development, stays on same domain for simpler testing
 */
export function getPostLoginRedirectUrl(
  authUser: AuthUser,
  profile?: UserProfile
): string {
  const enableSubdomainRouting = process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === 'true'
  
  // If subdomain routing is disabled (development), always use same-domain routing
  if (!enableSubdomainRouting) {
    // All users redirect to /dashboard on same domain
    return '/dashboard'
  }
  
  // Production: use subdomain-based routing
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:'
  const baseDomain = getBaseDomain()

  // Super Admin redirect - always use superadmin subdomain
  if (authUser.isSuperAdmin) {
    return `${protocol}//superadmin.${baseDomain}/dashboard`
  }

  // Admin redirect - always use admin subdomain
  if (authUser.isAdmin) {
    return `${protocol}//admin.${baseDomain}/dashboard`
  }

  // Store Owner/Admin redirect - redirect to their store subdomain
  if (authUser.isStoreOwner || authUser.isStoreAdmin) {
    // Use storeSubdomain from profile, fallback to storeName conversion
    const subdomain = profile?.storeSubdomain || 
                     profile?.storeName?.toLowerCase().replace(/\s+/g, '') || 
                     'store'
    
    return `${protocol}//${subdomain}.${baseDomain}/dashboard`
  }

  // Default user redirect
  return '/dashboard'
}

/**
 * Get base domain from current URL or environment
 * Returns 'localhost:3000' for localhost or 'inventory.tatvacraft.com' for production
 */
function getBaseDomain(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_STORE_DOMAIN_SUFFIX || 'localhost:3000'
  }
  
  const hostname = window.location.hostname
  const port = window.location.port
  
  // For localhost, return localhost with port (supports subdomain.localhost:3000)
  if (hostname.endsWith('localhost') || hostname === '127.0.0.1') {
    return port ? `localhost:${port}` : 'localhost:3000'
  }
  
  // Extract base domain (e.g., inventory.tatvacraft.com from store1.inventory.tatvacraft.com)
  const parts = hostname.split('.')
  if (parts.length >= 2) {
    return parts.slice(-2).join('.')
  }
  
  return hostname
}

/**
 * Perform redirect after login
 * Uses window.location for subdomain redirects (full page reload)
 * Uses router.push for same-domain redirects (SPA navigation)
 */
export function performPostLoginRedirect(
  authUser: AuthUser,
  profile?: UserProfile,
  router?: any
): void {
  const redirectUrl = getPostLoginRedirectUrl(authUser, profile)
  
  // Check if redirect URL is external (different subdomain)
  const isExternalRedirect = redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')
  
  if (isExternalRedirect) {
    // Full page redirect to different subdomain
    window.location.href = redirectUrl
  } else {
    // SPA navigation within same domain
    if (router) {
      router.push(redirectUrl)
    } else {
      window.location.href = redirectUrl
    }
  }
}

/**
 * Check if current subdomain matches user's role/store
 * Returns true if user is on correct subdomain, false otherwise
 */
export function isOnCorrectSubdomain(authUser: AuthUser, profile?: UserProfile): boolean {
  if (typeof window === 'undefined') return true
  
  const hostname = window.location.hostname
  
  // Extract current subdomain
  const parts = hostname.split('.')
  const currentSubdomain = parts.length > 1 && hostname.includes('.') ? parts[0] : ''
  
  // Check if subdomain matches role
  if (authUser.isSuperAdmin) {
    return currentSubdomain === 'superadmin'
  }
  
  if (authUser.isAdmin) {
    return currentSubdomain === 'admin'
  }
  
  if (authUser.isStoreOwner || authUser.isStoreAdmin) {
    const subdomain = profile?.storeSubdomain || 
                     profile?.storeName?.toLowerCase().replace(/\s+/g, '')
    return currentSubdomain === subdomain
  }
  
  return true
}
