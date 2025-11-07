// src/app/api/messages/[messageId]/react/route.ts

import { getCurrentUser } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/messages/[messageId]/react
 * Add reaction to a message
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messageId } = await params
    const { emoji } = await request.json()

    if (!emoji) {
      return NextResponse.json({ error: 'Emoji required' }, { status: 400 })
    }

    // Toggle reaction (remove if exists, add if not)
    const existing = await prisma.messageReaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId: user.userId,
          emoji
        }
      }
    })

    if (existing) {
      await prisma.messageReaction.delete({
        where: { id: existing.id }
      })
      return NextResponse.json({ action: 'removed' })
    } else {
      const reaction = await prisma.messageReaction.create({
        data: {
          messageId,
          userId: user.userId,
          emoji
        }
      })
      return NextResponse.json({ action: 'added', reaction })
    }
  } catch (error) {
    console.error('React to message error:', error)
    return NextResponse.json(
      { error: 'Failed to react to message' },
      { status: 500 }
    )
  }
}