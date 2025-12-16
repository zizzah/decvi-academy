// app/api/live-classes/[id]/start/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Pusher from 'pusher';
import { getCurrentUser } from '@/lib/auth-helpers';
// Add to TOP of each file (before imports):
export const dynamic = 'force-dynamic';

// ✅ Validate environment variables
if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_KEY || !process.env.PUSHER_SECRET || !process.env.PUSHER_CLUSTER) {
  console.error('Missing Pusher environment variables:', {
    PUSHER_APP_ID: !!process.env.PUSHER_APP_ID,
    PUSHER_KEY: !!process.env.PUSHER_KEY,
    PUSHER_SECRET: !!process.env.PUSHER_SECRET,
    PUSHER_CLUSTER: !!process.env.PUSHER_CLUSTER,
  });
}

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

    // ✅ Add try-catch for Pusher trigger
    try {
      await pusher.trigger(`live-class-${id}`, 'class-started', {
        classId: id,
        meetingLink: liveClass.meetingLink,
      });
      console.log(`✅ Pusher notification sent for class ${id}`);
    } catch (pusherError) {
      // ⚠️ Log the error but don't fail the request
      console.error('Pusher notification failed:', pusherError);
      // Class is still marked as LIVE, just notifications didn't work
    }

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error('Error starting class:', error);
    return NextResponse.json(
      { error: 'Failed to start class' },
      { status: 500 }
    );
  }
}