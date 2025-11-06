// src/lib/instructor-auth.ts
import { getCurrentUser } from './auth-helpers'
import { NextResponse } from 'next/server'

/**
 * Middleware to require instructor authentication
 * Use this in API routes that should only be accessible by instructors
 */
export async function requireInstructor() {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  if (user.role !== 'INSTRUCTOR') {
    return NextResponse.json({ error: 'Forbidden - Instructor access only' }, { status: 403 })
  }
  
  return null
}