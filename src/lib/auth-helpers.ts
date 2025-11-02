// ============================================
// lib/auth-helpers.ts - Server-side auth helpers
// ============================================

import { cookies } from 'next/headers'
import { verifyToken } from './auth'

/**
 * Get the current authenticated user from cookies
 * Use this in Server Components and API routes
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')
    
    if (!token?.value) {
      return null
    }

    const payload = await verifyToken(token.value)
    return payload
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === role
}