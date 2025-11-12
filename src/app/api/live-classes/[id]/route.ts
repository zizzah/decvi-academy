


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

// Get a specific live class
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const liveClass = await prisma.liveClass.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        course: true,
        instructor: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            bio: true,
          },
        },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!liveClass) {
      return NextResponse.json({ error: 'Live class not found' }, { status: 404 });
    }

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error('Error fetching live class:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live class' },
      { status: 500 }
    );
  }
}

// Update live class (Instructor only)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId|| session.role !== 'Instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const classId = parseInt(params.id);
    const updates = await req.json();

    // Verify ownership
    const existing = await prisma.liveClass.findUnique({
      where: { id: classId },
      select: { instructorId: true },
    });

    if (!existing || existing.instructorId !== parseInt(session.userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const liveClass = await prisma.liveClass.update({
      where: { id: classId },
      data: updates,
      include: {
        course: true,
        instructor: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Notify enrolled students of changes
    await pusher.trigger(`live-class-${classId}`, 'class-updated', liveClass);

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error('Error updating live class:', error);
    return NextResponse.json(
      { error: 'Failed to update live class' },
      { status: 500 }
    );
  }
}

// Delete live class (Instructor only)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId || session.role !== 'Instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const classId = parseInt(params.id);

    // Verify ownership
    const existing = await prisma.liveClass.findUnique({
      where: { id: classId },
      select: { instructorId: true },
    });

    if (!existing || existing.instructorId !== parseInt(session.userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.liveClass.delete({
      where: { id: classId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting live class:', error);
    return NextResponse.json(
      { error: 'Failed to delete live class' },
      { status: 500 }
    );
  }
}