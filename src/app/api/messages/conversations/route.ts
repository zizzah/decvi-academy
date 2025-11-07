// src/app/api/messages/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'

/**
 * GET /api/messages/conversations
 * Fetch all conversations for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: user.userId }
        },
        isArchived: false,
        ...(type && { type: type as any })
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                student: { select: { firstName: true, lastName: true, photoUrl: true } },
                instructor: { select: { firstName: true, lastName: true, photoUrl: true } },
                admin: { select: { firstName: true, lastName: true } }
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                student: { select: { firstName: true, lastName: true } },
                instructor: { select: { firstName: true, lastName: true } }
              }
            }
          }
        },
        cohort: { select: { name: true } },
        class: { select: { title: true } }
      },
      orderBy: { lastMessageAt: 'desc' }
    })

    // Calculate unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const participant = conv.participants.find(p => p.userId === user.userId)
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            createdAt: { gt: participant?.lastReadAt || new Date(0) },
            senderId: { not: user.userId }
          }
        })

        return {
          ...conv,
          unreadCount
        }
      })
    )

    return NextResponse.json(conversationsWithUnread)
  } catch (error) {
    console.error('Fetch conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/messages/conversations
 * Create a new conversation
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, name, participantIds, cohortId, classId } = body

    // Validate participants
    if (!participantIds || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one participant required' },
        { status: 400 }
      )
    }

    // For DIRECT conversations, check if one already exists
    if (type === 'DIRECT' && participantIds.length === 1) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: 'DIRECT',
          participants: {
            every: {
              userId: { in: [user.userId, participantIds[0]] }
            }
          }
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  student: { select: { firstName: true, lastName: true, photoUrl: true } },
                  instructor: { select: { firstName: true, lastName: true, photoUrl: true } }
                }
              }
            }
          }
        }
      })

      if (existingConversation) {
        return NextResponse.json(existingConversation)
      }
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        type,
        name,
        cohortId,
        classId,
        createdBy: user.userId,
        participants: {
          create: [
            { userId: user.userId, role: 'ADMIN' },
            ...participantIds.map((id: string) => ({ userId: id, role: 'MEMBER' }))
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                student: { select: { firstName: true, lastName: true, photoUrl: true } },
                instructor: { select: { firstName: true, lastName: true, photoUrl: true } }
              }
            }
          }
        }
      }
    })

    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
