// src/app/instructor/layout.tsx
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication and authorization
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  if (user.role !== 'INSTRUCTOR') {
    redirect('/unauthorized')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600" />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  )
}