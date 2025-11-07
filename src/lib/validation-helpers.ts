
// ============================================
// 8. lib/validation-helpers.ts - Additional Validators
// ============================================

import { z } from 'zod'


const urlRegex =
  /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i

const isoDatetimeRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})?$/


export const phoneNumberSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  'Invalid phone number format'
)

export const urlSchema = z.string().regex(
  urlRegex,
  'Invalid URL format'
)

export const dateRangeSchema = z.object({
  startDate: z.string().regex(isoDatetimeRegex, 'Invalid ISO datetime format'),
  endDate: z.string().regex(isoDatetimeRegex, 'Invalid ISO datetime format'),
}).refine(
  data => new Date(data.startDate) < new Date(data.endDate),
  { message: 'End date must be after start date' }
)

export const githubRepoSchema = z.string().regex(
  /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/,
  'Invalid GitHub repository URL'
)

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
