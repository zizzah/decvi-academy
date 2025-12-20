'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, User, BookOpen, GraduationCap } from 'lucide-react'
import NotificationsDropdown from '@/components/NotificationsDropdown'

interface NavbarProps {
  onMenuClick: () => void
  studentName: string
  studentId: string
}

export function Navbar({ onMenuClick, studentName, studentId }: NavbarProps) {
  const pathname = usePathname()

  // Dynamic page title based on current route
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname === '/study') return 'Study'
    if (pathname?.startsWith('/study/lesson/')) return 'Lesson'
    if (pathname === '/study/courses') return 'Browse Courses'
    if (pathname?.startsWith('/study/course/')) return 'Course Details'
    if (pathname?.startsWith('/dashboard/projects')) return 'Projects'
    if (pathname?.startsWith('/dashboard/assignments')) return 'Assignments'
    if (pathname?.startsWith('/dashboard/progress')) return 'Progress'
    if (pathname?.startsWith('/dashboard/achievements')) return 'Achievements'
    if (pathname?.startsWith('/dashboard/settings')) return 'Settings'
    return 'Dashboard'
  }

  // Dynamic icon based on current route
  const getPageIcon = () => {
    if (pathname === '/study' || pathname?.startsWith('/study/')) {
      return <GraduationCap className="w-5 h-5 text-blue-600" />
    }
    return null
  }

  const pageTitle = getPageTitle()
  const pageIcon = getPageIcon()

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Menu Button (Mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Center: Page Title with Icon */}
        <div className="flex-1 lg:ml-0 ml-4">
          <div className="flex items-center gap-2">
            {pageIcon}
            <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
          </div>
        </div>

        {/* Right: Notifications & User */}
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