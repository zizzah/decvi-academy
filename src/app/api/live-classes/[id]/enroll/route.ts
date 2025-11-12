// app/api/live-classes/[id]/start/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Pusher from 'pusher';
import { getCurrentUser } from '@/lib/auth-helpers';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId || session.role !== 'Instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const classId = parseInt(params.id);

    const liveClass = await prisma.liveClass.update({
      where: { id: classId },
      data: { status: 'LIVE' },
      include: {
        enrollments: {
          include: {
            student: true,
          },
        },
      },
    });

    // Notify all enrolled students
    await pusher.trigger(`live-class-${classId}`, 'class-started', {
      classId,
      meetingLink: liveClass.meetingLink,
    });

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error('Error starting class:', error);
    return NextResponse.json(
      { error: 'Failed to start class' },
      { status: 500 }
    );
  }
}