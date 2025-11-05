// src/lib/admin-auth.ts
import { getCurrentUser } from './auth-helpers'
import { NextResponse } from 'next/server'

export async function requireAdmin() {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  return null
}