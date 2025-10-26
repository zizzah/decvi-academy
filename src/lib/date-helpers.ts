// ============================================
// 9. lib/date-helpers.ts - Date Utility Functions
// ============================================

/**
 * Returns the current academic week based on the given cohort start date.
 * The academic week is calculated as follows:
 *   - The month number is calculated by dividing the number of weeks since the cohort start date by 4.
 *   - The week number is calculated by taking the remainder of the division of the number of weeks since the cohort start date by 4, and adding 1.
 * The returned object contains the month number and the week number, both of which are capped at 3 and 4, respectively.
 * @param {Date} cohortStartDate - The start date of the cohort.
 * @returns {{ month: number, week: number }} - An object containing the month number and the week number.
 */
export function getCurrentAcademicWeek(cohortStartDate: Date): { month: number; week: number } {
  const now = new Date()
  const start = new Date(cohortStartDate)
  
  const daysDiff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const weekNumber = Math.floor(daysDiff / 7) + 1
  
  const month = Math.ceil(weekNumber / 4)
  const week = ((weekNumber - 1) % 4) + 1
  
  return {
    month: Math.min(month, 3),
    week: Math.min(week, 4),
  }
}

export function getMonthDateRange(monthNumber: number, cohortStartDate: Date) {
  const startDate = new Date(cohortStartDate)
/**
 * Returns an object containing the start and end dates of the given month number based on the cohort start date.
 * The start date is calculated by adding the number of days in the given month number multiplied by 28 to the cohort start date.
 * The end date is calculated by adding 27 days to the start date.
 * @param {number} monthNumber - The month number to get the date range for.
 * @param {Date}cohortStartDate - The start date of the cohort.
 * @returns {{ startDate: Date, endDate: Date }} - An object containing the start and end dates of the given month number.
 */
  startDate.setDate(startDate.getDate() + (monthNumber - 1) * 28)
  
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 27)
  
  return { startDate, endDate }
}

/**
 * Returns an object containing the start and end dates of the given week number based on the cohort start date.
 * The start date is calculated by adding the number of days in the given month number multiplied by 28 and the given week number multiplied by 7 to the cohort start date.
 * The end date is calculated by adding 6 days to the start date.
 * @param {number} monthNumber - The month number to get the date range for.
 * @param {number}weekNumber - The week number to get the date range for.
 * @param {Date}cohortStartDate - The start date of the cohort.
 * @returns {{ startDate: Date, endDate: Date }} - An object containing the start and end dates of the given week number.
 */
export function getWeekDateRange(monthNumber: number, weekNumber: number, cohortStartDate: Date) {
  const startDate = new Date(cohortStartDate)
  const daysToAdd = ((monthNumber - 1) * 28) + ((weekNumber - 1) * 7)
  startDate.setDate(startDate.getDate() + daysToAdd)
  
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 6)
  
  return { startDate, endDate }
}

/**
 * Returns a formatted string representing the duration in minutes.
 * If the duration is less than 60 minutes, it is represented in minutes (e.g. 30m).
 * Otherwise, it is represented in hours and minutes (e.g. 1h 30m).
 * @param {number} minutes - The duration in minutes.
 * @returns {string} - A formatted string representing the duration.
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/**
 * Returns a formatted string representing the time difference between the given date and the current date.
 * The time difference is represented in a human-readable format, such as "just now", "Xm ago", "Xh ago", "Xd ago", "Xw ago", or the full date string if the time difference is more than 30 days.
 * @param {Date} date - The date to get the relative time for.
 * @returns {string} - A formatted string representing the time difference between the given date and the current date.
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return date.toLocaleDateString()
}
