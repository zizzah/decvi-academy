import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Home,
  FolderKanban,
  BookOpen,
  BarChart3,
  Award,
  Settings,
  LogOut
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  
  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', active: true, href: '/dashboard' },
    { icon: <FolderKanban className="w-5 h-5" />, label: 'Projects', href: '/dashboard/projects' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Assignments', href: '/dashboard/assignments' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Progress', href: '/dashboard/progress' },
    { icon: <Award className="w-5 h-5" />, label: 'Achievements', href: '/dashboard/achievements' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/dashboard/settings' },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/auth/login')
    }
  }

  return (
    <div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64 transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">DC VI Academy</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href || '#'}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </div>
  )
}