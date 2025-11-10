
// app/api/messages/[conversationId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
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
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversationId = parseInt(params.conversationId);
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const limit = 50;

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true,
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
          id: parseInt(cursor),
        },
      }),
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
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversationId = parseInt(params.conversationId);
    const { content, fileUrl, fileType } = await req.json();

    const message = await prisma.message.create({
      data: {
        content,
        fileUrl,
        fileType,
        conversationId,
        senderId: parseInt(session.user.id),
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    // Update conversation's last message
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: content,
        lastMessageAt: new Date(),
        updatedAt: new Date(),
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
