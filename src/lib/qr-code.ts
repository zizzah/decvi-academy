

import { prisma } from './prisma'
// ============================================
// 5. lib/qr-code.ts - QR Code Generator
// ============================================

/**
 * Generates a unique QR code string for a given class ID.
 * The QR code string is in the format of <classId>-<timestamp>-<random string>.
 * The timestamp is the current timestamp in milliseconds, and the random string is a 8 character string generated using Math.random().
 * @param {string} classId - the class ID to generate the QR code for
 * @returns {string} the QR code string
 */
export function generateAttendanceQR(classId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `${classId}-${timestamp}-${random}`
}

/**
 * Creates a new attendance QR code for a given class ID.
 * The QR code will be set to expire after the given number of minutes.
 * @param {string} classId - the class ID to generate the QR code for
 * @param {number} [expiryMinutes=15] - the number of minutes after which the QR code will expire
 * @returns {Promise<Prisma.AttendanceQRCode>>} - a promise that resolves to the created attendance QR code
 */
export async function createAttendanceQRCode(classId: string, expiryMinutes: number = 15) {
  const code = generateAttendanceQR(classId)
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes)

  return await prisma.attendanceQRCode.create({
    data: {
      classId,
      code,
      expiresAt,
      isActive: true,
    },
  })
}

/**
 * Validates an attendance QR code
 * @param {string} code - the attendance QR code to validate
 * @returns {Promise<{ valid: boolean; classId?: string }>} - a promise that resolves to an object with a 'valid' property indicating whether the QR code is valid, and an optional 'classId' property containing the class ID associated with the valid QR code
 */
export async function validateQRCode(code: string): Promise<{ valid: boolean; classId?: string }> {
  const qrCode = await prisma.attendanceQRCode.findUnique({
    where: { code },
  })

  if (!qrCode || !qrCode.isActive || new Date() > qrCode.expiresAt) {
    return { valid: false }
  }

  return { valid: true, classId: qrCode.classId }
}
