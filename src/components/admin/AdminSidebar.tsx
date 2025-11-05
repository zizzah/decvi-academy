// src/components/admin/AdminSidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  BarChart3,
  Award,
  Settings,
  Bell,
  FolderKanban,
  UserCog,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

type NavItem = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  children?: {
    title: string
    href: string
  }[]
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Students',
    href: '/admin/students',
    icon: Users,
    children: [
      { title: 'All Students', href: '/admin/students' },
      { title: 'Enrollments', href: '/admin/students/enrollments' },
      { title: 'At Risk', href: '/admin/students/at-risk' },
    ],
  },
  {
    title: 'Cohorts',
    href: '/admin/cohorts',
    icon: GraduationCap,
    children: [
      { title: 'All Cohorts', href: '/admin/cohorts' },
      { title: 'Create Cohort', href: '/admin/cohorts/create' },
      { title: 'Schedules', href: '/admin/cohorts/schedules' },
    ],
  },
  {
    title: 'Classes',
    href: '/admin/classes',
    icon: BookOpen,
    children: [
      { title: 'All Classes', href: '/admin/classes' },
      { title: 'Schedule Class', href: '/admin/classes/schedule' },
      { title: 'Attendance', href: '/admin/classes/attendance' },
    ],
  },
  {
    title: 'Instructors',
    href: '/admin/instructors',
    icon: UserCog,
    children: [
      { title: 'All Instructors', href: '/admin/instructors' },
      { title: 'Add Instructor', href: '/admin/instructors/add' },
      { title: 'Performance', href: '/admin/instructors/performance' },
    ],
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: FolderKanban,
    children: [
      { title: 'All Projects', href: '/admin/projects' },
      { title: 'Reviews Pending', href: '/admin/projects/pending' },
      { title: 'Capstone Projects', href: '/admin/projects/capstone' },
    ],
  },
  {
    title: 'Assignments',
    href: '/admin/assignments',
    icon: FileText,
    children: [
      { title: 'All Assignments', href: '/admin/assignments' },
      { title: 'Create Assignment', href: '/admin/assignments/create' },
      { title: 'Results', href: '/admin/assignments/results' },
    ],
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    children: [
      { title: 'Overview', href: '/admin/analytics' },
      { title: 'Performance', href: '/admin/analytics/performance' },
      { title: 'Reports', href: '/admin/analytics/reports' },
    ],
  },
  {
    title: 'Certificates',
    href: '/admin/certificates',
    icon: Award,
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
    badge: 5,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const isExpanded = (title: string) => expandedItems.includes(title)

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">TechAcademy</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigationItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </div>
                  {isExpanded(item.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {isExpanded(item.title) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block rounded-lg px-3 py-2 text-sm transition-colors',
                          pathname === child.href
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-3">
          <p className="text-xs font-semibold text-gray-900">Need Help?</p>
          <p className="text-xs text-gray-600 mt-1">
            Check our documentation or contact support
          </p>
          <button className="mt-2 w-full rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
            View Docs
          </button>
        </div>
      </div>
    </aside>
  )
}