
// ============================================
// 2. lib/notifications.ts - Notification Service
// ============================================

import { prisma } from './prisma'
import { NotificationType } from '@prisma/client'

export async function createNotification({
  userId,
  type,
  title,
  message,
  actionUrl,
  metadata,
}: {
  userId: string
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
  metadata?: any
}) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      actionUrl,
      metadata,
    },
  })
}

export async function createBulkNotifications({
  userIds,
  type,
  title,
  message,
  actionUrl,
}: {
  userIds: string[]
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
}) {
  return await prisma.notification.createMany({
    data: userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      actionUrl,
    })),
  })
}

export async function markNotificationAsRead(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  })
}

/**
 * Marks all notifications for a given user as read.
 *
 * @param {string} userId - The user ID.
 *
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export async function markAllNotificationsAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  })
}

/**
 * Returns the count of unread notifications for a given user.
 *
 * @param {string} userId - The user ID.
 *
 * @returns {Promise<number>} - The count of unread notifications.
 */
export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  return await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  })
}
