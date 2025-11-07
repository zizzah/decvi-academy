

// src/app/api/messages/[conversationId]/route.ts

import { getCurrentUser } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/messages/[conversationId]
 * Fetch messages for a conversation
 */



// src/app/api/messages/[conversationId]/route.ts
/**
 * GET /api/messages/[conversationId]
 * Fetch messages for a conversation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = await params
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Check if user is participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.userId
        }
      }
    })

    if (!participant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        isDeleted: false,
        ...(cursor && { id: { lt: cursor } })
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            student: { select: { firstName: true, lastName: true, photoUrl: true } },
            instructor: { select: { firstName: true, lastName: true, photoUrl: true } }
          }
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                student: { select: { firstName: true, lastName: true } },
                instructor: { select: { firstName: true, lastName: true } }
              }
            }
          }
        },
        replies: {
          take: 3,
          include: {
            sender: {
              select: {
                id: true,
                student: { select: { firstName: true, lastName: true } },
                instructor: { select: { firstName: true, lastName: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Update last read timestamp
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.userId
        }
      },
      data: { lastReadAt: new Date() }
    })

    const hasMore = messages.length === limit
    const nextCursor = hasMore ? messages[messages.length - 1].id : null

    return NextResponse.json({
      messages: messages.reverse(),
      nextCursor,
      hasMore
    })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

