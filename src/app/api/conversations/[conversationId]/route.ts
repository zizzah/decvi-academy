// app/api/messages/[conversationId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-helpers';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Get messages for a conversation
export async function GET(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> } // Changed to Promise
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await params; // Await params
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const limit = 50;

    // Verify user is participant in this conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.userId,
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Not a participant in this conversation' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        isDeleted: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        readReceipts: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
    });

    // Update last read timestamp
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return NextResponse.json({
      messages,
      nextCursor: messages.length === limit ? messages[messages.length - 1].id : null,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Send a message
export async function POST(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> } // Changed to Promise
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await params; // Await params
    const { content, fileUrl, fileName, fileSize, type = 'TEXT', parentId } = await req.json();

    // Verify user is participant in this conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.userId,
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Not a participant in this conversation' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        type,
        fileUrl,
        fileName,
        fileSize,
        conversationId,
        senderId: user.userId,
        parentId,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        reactions: true,
        readReceipts: true,
      },
    });

    // Update conversation's lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create read receipt for sender
    await prisma.messageReadReceipt.create({
      data: {
        messageId: message.id,
        userId: user.userId,
      },
    });

    // Trigger Pusher event
    await pusher.trigger(`conversation-${conversationId}`, 'new-message', message);

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}