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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' }, 
        { status: 401 }
      );
    }

    if (session.role !== 'INSTRUCTOR') {
      return NextResponse.json(
        { error: 'Unauthorized: Only instructors can start classes' }, 
        { status: 403 }
      );
    }

    // ✅ Get the instructor record
    const instructor = await prisma.instructor.findUnique({
      where: { userId: session.userId }
    });

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor profile not found' },
        { status: 404 }
      );
    }

    const { id } = await params;

    // ✅ Optional: Verify the class belongs to this instructor
    const existingClass = await prisma.liveClass.findUnique({
      where: { id },
    });

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Live class not found' },
        { status: 404 }
      );
    }

    if (existingClass.instructorId !== instructor.id) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only start your own classes' },
        { status: 403 }
      );
    }

    const liveClass = await prisma.liveClass.update({
      where: { id },
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
    await pusher.trigger(`live-class-${id}`, 'class-started', {
      classId: id,
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