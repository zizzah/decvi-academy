// app/api/messages/conversations/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-helpers';
// Add to TOP of each file (before imports):
// Get all conversations for current user
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const conversations = await prisma.conversation.findMany({
      where: {
        isArchived: false,
        participants: {
          some: {
            userId: user.userId,
          },
        },
        ...(type && { type: type as 'DIRECT' | 'GROUP' | 'COHORT_CHANNEL' | 'CLASS_CHANNEL' | 'ANNOUNCEMENT' }),
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            isDeleted: false,
          },
          include: {
            sender: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        cohort: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    // Calculate unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const participant = conv.participants.find((p) => p.userId === user.userId);
        
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            createdAt: {
              gt: participant?.lastReadAt || new Date(0),
            },
            senderId: {
              not: user.userId,
            },
            isDeleted: false,
          },
        });

        return {
          ...conv,
          unreadCount,
        };
      })
    );

    return NextResponse.json(conversationsWithUnread);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// Create new conversation
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      participantIds, 
      type = 'DIRECT', 
      name, 
      cohortId, 
      classId 
    } = await req.json();
    
    // Validate conversation type
    const validTypes = ['DIRECT', 'GROUP', 'COHORT_CHANNEL', 'CLASS_CHANNEL', 'ANNOUNCEMENT'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid conversation type' }, { status: 400 });
    }

    // Add current user to participants if not already included
    const allParticipants = [...new Set([...participantIds, user.userId])];

    // Check if direct conversation already exists between these two users
    if (type === 'DIRECT' && allParticipants.length === 2) {
      const existing = await prisma.conversation.findFirst({
        where: {
          type: 'DIRECT',
          AND: [
            {
              participants: {
                some: {
                  userId: allParticipants[0],
                },
              },
            },
            {
              participants: {
                some: {
                  userId: allParticipants[1],
                },
              },
            },
          ],
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
      });

      if (existing && existing.participants.length === 2) {
        return NextResponse.json(existing);
      }
    }

    // Validate GROUP conversations have a name
    if (type === 'GROUP' && !name) {
      return NextResponse.json({ error: 'Group conversations must have a name' }, { status: 400 });
    }

    const conversation = await prisma.conversation.create({
      data: {
        type,
        name,
        cohortId,
        classId,
        createdBy: user.userId,
        participants: {
          create: allParticipants.map((userId) => ({
            userId,
            role: userId === user.userId ? 'ADMIN' : 'MEMBER',
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}