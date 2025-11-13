// lib/auth-helpers.ts
import { cookies } from 'next/headers'
import { verifyToken } from './auth'
import { prisma } from './prisma'

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

// ✅ NEW: Get current instructor profile
export async function getCurrentInstructor() {
  const session = await getCurrentUser();
  
  if (!session?.userId || session.role !== 'INSTRUCTOR') {
    return null;
  }

  const instructor = await prisma.instructor.findUnique({
    where: { userId: session.userId }
  });

  return instructor;
}

// ✅ NEW: Get current student profile
export async function getCurrentStudent() {
  const session = await getCurrentUser();
  
  if (!session?.userId || session.role !== 'STUDENT') {
    return null;
  }

  const student = await prisma.student.findUnique({
    where: { userId: session.userId }
  });

  return student;
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === role
}