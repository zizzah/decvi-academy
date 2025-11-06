// src/app/admin/layout.tsx
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminNavbar from '../../components/admin/AdminNavbar'
import { getCurrentUser } from '@/lib/auth-helpers'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication and authorization
  const user = await getCurrentUser()

  if (!user) {
    redirect('auth/login')
  }

  if (user.role !== 'ADMIN') {
    redirect('/unauthorized')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col ml-64">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  )
}