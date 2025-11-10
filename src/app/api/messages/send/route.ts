



// src/app/api/messages/send/route.ts

import { getCurrentUser } from "@/lib/auth-helpers"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'


/**
 * POST /api/messages/send
 * Send a new message
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { conversationId, content, type = 'TEXT', fileUrl, fileName, fileSize, parentId } = body

    if (!content && !fileUrl) {
      return NextResponse.json(
        { error: 'Message content or file required' },
        { status: 400 }
      )
    }

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

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.userId,
        content,
        type,
        fileUrl,
        fileName,
        fileSize,
        parentId
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            student: { select: { firstName: true, lastName: true, photoUrl: true } },
            instructor: { select: { firstName: true, lastName: true, photoUrl: true } }
          }
        }
      }
    })

    // Update conversation last message timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    })

    // TODO: Send real-time notification to other participants
    // This will be handled by WebSocket/Pusher in the next step

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
