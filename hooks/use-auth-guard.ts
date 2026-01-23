import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface AuthUser {
  role: string
  isSuperAdmin: boolean
  isAdmin: boolean
  isStoreOwner: boolean
  isStoreAdmin: boolean
}

export function useAuthGuard() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      
      // No token = redirect to login
      if (!token) {
        router.push('/login')
        return false
      }

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const expirationTime = payload.exp * 1000 // Convert to milliseconds
        const currentTime = Date.now()

        // Token expired = redirect to login
        if (currentTime > expirationTime) {
          localStorage.removeItem('token')
          localStorage.removeItem('userRole')
          router.push('/login')
          return false
        }
      } catch (e) {
        // Invalid token format = redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        router.push('/login')
        return false
      }

      return true
    }

    // Initial check
    checkAuth()

    // Set up interval to check token validity every 30 seconds
    const interval = setInterval(checkAuth, 30000)

    return () => clearInterval(interval)
  }, [router])
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const role = payload.role || 'ROLE_USER'
    const isSuperAdmin = role === 'ROLE_SUPER_ADMIN'
    const isAdmin = role === 'ROLE_ADMIN'
    const isStoreOwner = role === 'ROLE_STORE_OWNER'
    const isStoreAdmin = role === 'ROLE_STORE_ADMIN'

    return {
      role,
      isSuperAdmin,
      isAdmin,
      isStoreOwner,
      isStoreAdmin,
    }
  } catch (e) {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expirationTime = payload.exp * 1000
    return Date.now() > expirationTime
  } catch (e) {
    return true
  }
}
