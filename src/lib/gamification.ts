// ============================================
// 3. lib/gamification.ts - Gamification Logic
// ============================================

import { prisma } from './prisma'
import { AchievementType } from '../generated/prisma'
import { createNotification } from './notifications'

/**
 * Awards points to a student.
 *
 * @param {string} studentId - The ID of the student to award points to.
 * @param {number} points - The number of points to award.
 * @param {string} reason - A description of why the points were awarded.
 *
 * @returns {Promise<void>} A promise that resolves when the points have been awarded.
 */
export async function awardPoints(
  studentId: string,
  points: number,
  reason: string
): Promise<void> {
  await prisma.student.update({
    where: { id: studentId },
    data: {
      totalPoints: { increment: points },
    },
  })

  await prisma.activity.create({
    data: {
      studentId,
      type: 'LOGIN', // Generic type, should be more specific
      description: reason,
      points,
    },
  })
}


/**
 * Updates a student's login streak.
 *
 * If the student has not logged in for more than a day, their streak is broken.
 * If the student has logged in for the first time, their streak is set to 1.
 * If the student has logged in for consecutive days, their streak is incremented.
 * If the student's streak reaches 7 or 30 days, they are awarded a milestone achievement.
 *
 * @param {string} studentId - The ID of the student to update the streak for.
 *
 * @returns {Promise<void>} A promise that resolves when the streak has been updated.
 */
export async function updateStreak(studentId: string): Promise<void> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  })

  if (!student) return

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastActivity = student.lastActivityDate
    ? new Date(student.lastActivityDate)
    : null

  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0)
    const daysDiff = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysDiff === 1) {
      // Continue streak
      const newStreak = student.currentStreak + 1
      await prisma.student.update({
        where: { id: studentId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, student.longestStreak),
          lastActivityDate: new Date(),
        },
      })

      // Award streak milestones
      if (newStreak === 7) {
        await unlockAchievement(studentId, 'MILESTONE', '7-Day Streak', 'Maintained a 7-day login streak')
      } else if (newStreak === 30) {
        await unlockAchievement(studentId, 'MILESTONE', '30-Day Streak', 'Maintained a 30-day login streak')
      }
    } else if (daysDiff > 1) {
      // Streak broken
      await prisma.student.update({
        where: { id: studentId },
        data: {
          currentStreak: 1,
          lastActivityDate: new Date(),
        },
      })
    }
  } else {
    // First activity
    await prisma.student.update({
      where: { id: studentId },
      data: {
        currentStreak: 1,
        lastActivityDate: new Date(),
      },
    })
  }
}

/**
 * Unlocks an achievement for a student.
 *
 * @param {string} studentId - the ID of the student to unlock the achievement for
 * @param {AchievementType} type - the type of achievement to unlock
 * @param {string} name - the name of the achievement to unlock
 * @param {string} description - the description of the achievement to unlock
 * @param {number} points - the number of points to award for unlocking the achievement
 * @returns {Promise<void>} a promise that resolves when the achievement has been unlocked
 */
export async function unlockAchievement(
  studentId: string,
  type: AchievementType,
  name: string,
  description: string,
  points: number = 100
): Promise<void> {
  // Check if already unlocked
  const existing = await prisma.achievement.findFirst({
    where: {
      studentId,
      name,
    },
  })

  if (existing) return

  await prisma.achievement.create({
    data: {
      studentId,
      type,
      name,
      description,
      criteria: 'Auto-unlocked',
      points,
    },
  })

  await awardPoints(studentId, points, `Achievement unlocked: ${name}`)

  // Notify student
  await createNotification({
    userId: (await prisma.student.findUnique({ where: { id: studentId } }))!.userId,
    type: 'ACHIEVEMENT_EARNED',
    title: 'Achievement Unlocked! 🏆',
    message: `You've earned "${name}" - ${description}`,
    actionUrl: '/dashboard/achievements',
  })
}

/**
 * Updates the leaderboard for the given period.
 *
 * The leaderboard is updated by deleting all existing leaderboard entries for the given period and then creating new entries for the top 100 students.
 *
 * The period can be one of the following:
 *  - 'weekly': The leaderboard is updated for the current week.
 *  - 'monthly': The leaderboard is updated for the current month.
 *  - 'overall': The leaderboard is updated for all time.
 *
 * @param {string} period - The period to update the leaderboard for.
 * @returns {Promise<void>} A promise that resolves when the leaderboard has been updated.
 */
export async function updateLeaderboard(period: 'weekly' | 'monthly' | 'overall'): Promise<void> {
  const students = await prisma.student.findMany({
    where: { enrollmentStatus: 'ACTIVE' },
    orderBy: { totalPoints: 'desc' },
    take: 100,
  })

  const now = new Date()
  let periodStart: Date
  let periodEnd: Date

  if (period === 'weekly') {
    periodStart = new Date(now.setDate(now.getDate() - now.getDay()))
    periodEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6))
  } else if (period === 'monthly') {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  } else {
    periodStart = new Date(0)
    periodEnd = new Date()
  }

  await prisma.leaderboard.deleteMany({
    where: {
      period,
      periodStart,
    },
  })

  await prisma.leaderboard.createMany({
    data: students.map((student, index) => ({
      studentId: student.id,
      period,
      rank: index + 1,
      score: student.totalPoints,
      category: 'points',
      periodStart,
      periodEnd,
    })),
  })
}