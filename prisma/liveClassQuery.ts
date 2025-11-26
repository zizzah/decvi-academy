import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function queryLiveClassesForStudent(studentUserId: string) {
  // Get student profile by userId
  const student = await prisma.student.findUnique({
    where: { userId: studentUserId },
    select: { id: true, cohortId: true },
  })
  if (!student) {
    console.error('Student not found for userId:', studentUserId)
    process.exit(1)
  }
  const studentId = student.id
  const cohortId = student.cohortId

  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)

  // Query live classes for the cohort or null cohort, scheduled today, with status scheduled or live
  const liveClasses = await prisma.liveClass.findMany({
    where: {
      AND: [
        {
          OR: [
            { cohortId: cohortId },
            { cohortId: null }
          ],
        },
        {
          status: { in: ['SCHEDULED', 'LIVE'] }
        }
      ],
      scheduledAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      enrollments: {
        where: {
          studentId: studentId,
        },
      },
    },
  })

  console.log(`Live classes for student ${studentId} (cohort ${cohortId}):`)

  for (const cls of liveClasses) {
    console.log(`- Class ID: ${cls.id}, Title: ${cls.title}, CohortId: ${cls.cohortId}, Status: ${cls.status}`)
    console.log(`  Enrollments for student: ${cls.enrollments.length}`)
    if (cls.enrollments.length > 0) {
      const e = cls.enrollments[0]
      console.log(`  Attended: ${e.attended}, JoinedAt: ${e.joinedAt}`)
    }
  }
}

const userId = process.argv[2]

if (!userId) {
  console.error('Usage: ts-node prisma/liveClassQuery.ts <studentUserId>')
  process.exit(1)
}

queryLiveClassesForStudent(userId).finally(() => prisma.$disconnect())
