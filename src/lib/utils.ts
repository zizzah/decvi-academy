// ============================================
// 5. lib/utils.ts - Helper Functions
// ============================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Helper function to merge tailwind classes.
 * @param {...inputs} - tailwind classes to merge
 * @returns merged tailwind class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate the attendance rate given the number of attended sessions and the total number of sessions.
 * @param {number} attended - number of attended sessions
 * @param {number} total - total number of sessions
 * @returns {number} attendance rate in percentage
 */
export function calculateAttendanceRate(attended: number, total: number): number {
  if (total === 0) return 0
  return Math.round((attended / total) * 100)
}

/**
 * Calculate the average score given an array of scores.
 * @param {number[]} scores - array of scores
 * @returns {number} average score in percentage
 */
export function calculateAverageScore(scores: number[]): number {
  if (scores.length === 0) return 0
  const sum = scores.reduce((acc, score) => acc + score, 0)
  return Math.round((sum / scores.length) * 100) / 100
}

/**
 * Returns the skill level based on the given score.
 * @param {number} score - score to determine the skill level
 * @returns {'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'} - skill level based on the score
 */
export function getSkillLevel(score: number): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' {
  if (score >= 90) return 'EXPERT'
  if (score >= 70) return 'ADVANCED'
  if (score >= 50) return 'INTERMEDIATE'
  return 'BEGINNER'
}

/**
 * Returns a formatted date string given a date object or a string in the format 'DD MMM YYYY'.
 * @param {Date|string} date - date object or a string in the format 'DD MMM YYYY'
 * @returns {string} formatted date string
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Returns a formatted date and time string given a date object or a string in the format 'DD MMM YYYY, HH:mm'.
 * @param {Date|string} date - date object or a string in the format 'DD MMM YYYY, HH:mm'
 * @returns {string} formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Generates a unique certificate number with the format 'DCVI-YYYY-XXXX'.
 * The first part 'DCVI' is the prefix, the second part 'YYYY' is the current year,
 * and the third part 'XXXX' is a random 6 character string.
 * @returns {string} a unique certificate number
 */
export function generateCertificateNumber(): string {
  const prefix = 'DCVI'
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${year}-${random}`
}

/**
 * Checks if a student is eligible for a certificate based on their attendance rate, number of projects completed,
 * average score, capstone pass status, and feedback submission status.
 * @param {number} attendanceRate - student attendance rate
 * @param {number}projectsCompleted - number of projects completed by the student
 * @param {number}averageScore - student average score
 * @param {boolean}capstonePassed - whether the student has passed the capstone
 * @param {boolean}feedbackSubmitted - whether the student has submitted feedback
 * @returns {boolean} true if the student is eligible for a certificate, false otherwise
 */
export function isEligibleForCertificate(
  attendanceRate: number,
  projectsCompleted: number,
  averageScore: number,
  capstonePassed: boolean,
  feedbackSubmitted: boolean
): boolean {
  return (
    attendanceRate >= 80 &&
    projectsCompleted >= 10 &&
    averageScore >= 70 &&
    capstonePassed &&
    feedbackSubmitted
  )
}

/**
 * Calculates the grade given a percentage.
 * @param {number} percentage - the percentage
 * @returns {string} the grade (A, B, C, D, F)
 */
export function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

/**
 * Returns the week number of a given date.
 * The week number is calculated as the number of days since the start of the year divided by 7.
 * @param {Date} date - the date to get the week number for
 * @returns {number} the week number
 */
export function getWeekNumber(date: Date): number {
  const startDate = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
  return Math.ceil(days / 7)
}


/**
 * Generates a unique QR code string for a given class ID.
 * The QR code string is in the format of <classId>-<timestamp>-<random string>.
 * The timestamp is the current timestamp in milliseconds, and the random string is a 8 character string generated using Math.random().
 * @param {string} classId - the class ID to generate the QR code for
 * @returns {string} the QR code string
 */
export function generateQRCode(classId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `${classId}-${timestamp}-${random}`
}
