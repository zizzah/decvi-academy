// ============================================
// 11. lib/search.ts - Search Functionality
// ============================================

import { prisma } from './prisma'

/**
 * Searches for students based on a query and optional cohort ID.
 *
 * @param {string} query - The search query to filter students by.
 * @param {string} [cohortId] - The ID of the cohort to search within. If not provided, all students are searched.
 *
 * @returns {Promise<Student[]>} A promise that resolves to an array of students that match the search query.
 * The returned students include their first name, last name, email, and cohort name.
 */
export async function searchStudents(query: string, cohortId?: string) {
  const whereClause: Record<string, unknown> = {
    OR: [
      { firstName: { contains: query, mode: 'insensitive' } },
      { lastName: { contains: query, mode: 'insensitive' } },
      { user: { email: { contains: query, mode: 'insensitive' } } },
    ],
  }

  if (cohortId) {
    whereClause.cohortId = cohortId
  }

  return await prisma.student.findMany({
    where: whereClause,
    include: {
      user: { select: { email: true } },
      cohort: { select: { name: true } },
    },
    take: 20,
  })
}

/**
 * Searches for resources based on a query and optional month number.
 *
 * @param {string} query - The search query to filter resources by.
 * @param {number} [monthNumber] - The month number to search within. If not provided, all resources are searched.
 *
 * @returns {Promise<Resource[]>} A promise that resolves to an array of resources that match the search query.
 * The returned resources include their title, description, topic, tags, and creation date.
 */
export async function searchResources(query: string, monthNumber?: number) {
  const whereClause: Record<string, unknown> = {
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { topic: { contains: query, mode: 'insensitive' } },
      { tags: { has: query.toLowerCase() } },
    ],
  }

  if (monthNumber) {
    whereClause.monthNumber = monthNumber
  }

  return await prisma.resource.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
}