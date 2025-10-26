
// ============================================
// 10. lib/rate-limiter.ts - Rate Limiting
// ============================================

import { prisma } from './prisma'

/**
 * Checks if a request to a given endpoint from a given identifier is within the allowed rate limit.
 * The rate limit is defined by the maximum number of requests within a given time window.
 * If the request is within the allowed rate limit, the function returns an object with the properties
 * `allowed` set to `true` and `remaining` set to the number of remaining requests within the time window.
 * If the request is not within the allowed rate limit, the function returns an object with the properties
 * `allowed` set to `false` and `remaining` set to `0`.
 * @param {string} identifier - The identifier of the request, e.g. user ID or IP address.
 * @param {string} endpoint - The endpoint of the request, e.g. API endpoint or website URL.
 * @param {number} [maxRequests=100] - The maximum number of requests within the time window.
 * @param {number} [windowMinutes=60] - The time window in minutes.
 * @returns {Promise<{ allowed: boolean; remaining: number }>} - A promise that resolves to an object with the properties `allowed` and `remaining`.
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  maxRequests: number = 100,
  windowMinutes: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date()
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000)

  // Clean up old rate limit records
  await prisma.rateLimit.deleteMany({
    where: {
      windowEnd: { lt: now },
    },
  })

  // Get current rate limit record
  const rateLimit = await prisma.rateLimit.findFirst({
    where: {
      identifier,
      endpoint,
      windowStart: { gte: windowStart },
    },
  })

  if (!rateLimit) {
    // Create new rate limit record
    const windowEnd = new Date(now.getTime() + windowMinutes * 60 * 1000)
    await prisma.rateLimit.create({
      data: {
        identifier,
        endpoint,
        requestCount: 1,
        windowStart: now,
        windowEnd,
      },
    })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (rateLimit.requestCount >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  // Increment request count
  await prisma.rateLimit.update({
    where: { id: rateLimit.id },
    data: { requestCount: { increment: 1 } },
  })

  return {
    allowed: true,
    remaining: maxRequests - (rateLimit.requestCount + 1),
  }
}
