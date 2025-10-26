
// ============================================
// 9. types/index.ts - TypeScript Types
// ============================================

import { User, Student, Instructor, UserRole } from '@/generated/prisma'

export type UserWithProfile = User & {
  student?: Student | null
  instructor?: Instructor | null
  admin?: Admin | null
}

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  profile?: Student | Instructor | Admin
}

export interface DashboardStats {
  totalStudents: number
  activeStudents: number
  totalClasses: number
  averageAttendance: number
  completionRate: number
}

export interface StudentProgress {
  attendanceRate: number
  projectsCompleted: number
  averageScore: number
  skillsProficiency: Array<{
    skillName: string
    level: string
    score: number
  }>
  monthlyProgress: Array<{
    month: number
    week: number
    completionRate: number
  }>
}

export interface RecommendationData {
  type: string
  priority: string
  title: string
  description: string
  actionUrl?: string
}

export interface Admin {
  id: string
  email: string
  name?: string | null
  role?: UserRole
  // add other admin fields as needed
}