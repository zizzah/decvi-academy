import React from 'react'
import { Button } from '@/components/ui/button'
import { Menu, User } from 'lucide-react'
import NotificationsDropdown from '@/components/NotificationsDropdown'
interface NavbarProps {
  onMenuClick: () => void
  studentName: string
  studentId: string
}

export function Navbar({ onMenuClick, studentName, studentId }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </Button>

        <div className="flex-1 lg:ml-0 ml-4">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationsDropdown studentId={studentId} />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-900">
              {studentName}
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}