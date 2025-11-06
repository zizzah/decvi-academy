
// ============================================
// 2. lib/notifications.ts - Notification Service
// ============================================

import { prisma } from './prisma'
import { NotificationType, Prisma } from '@prisma/client'

/**
 * Creates a notification for a user.
 *
 * @param {string} userId - The ID of the user to create the notification for.
 * @param {NotificationType} type - The type of notification to create.
 * @param {string} title - The title of the notification to create.
 * @param {string} message - The message of the notification to create.
 * @param {string} [actionUrl] - The URL to navigate to when the notification is clicked.
 * @param {Prisma.InputJsonValue | undefined} [metadata] - Additional metadata to store with the notification.
 *
 * @returns {Promise<Prisma.Notification>>} - A promise that resolves with the created notification.
 */
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
  metadata?: Prisma.InputJsonValue | undefined
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

/**
 * Creates multiple notifications for multiple users.
 *
 * @param {string[]} userIds - The IDs of the users to create the notifications for.
 * @param {NotificationType} type - The type of notification to create.
 * @param {string} title - The title of the notification to create.
 * @param {string} message - The message of the notification to create.
 * @param {string} [actionUrl] - The URL to navigate to when the notification is clicked.
 *
 * @returns {Promise<Prisma.BatchPayload>} - A promise that resolves with the created notifications.
 */
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

/**
 * Marks a notification as read.
 *
 * @param {string} notificationId - The ID of the notification to mark as read.
 *
 * @returns {Promise<void>} - A promise that resolves when the notification has been marked as read.
 */
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
