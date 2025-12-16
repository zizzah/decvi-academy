// app/api/live-classes/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-helpers';
// Add to TOP of each file (before imports):
export const dynamic = 'force-dynamic';
// Delete a live class (Instructor only)
export async function DELETE(
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
        { error: 'Unauthorized: Only instructors can delete classes' }, 
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

    // Verify the class belongs to the instructor
    const existingClass = await prisma.liveClass.findUnique({
      where: { id },
    });

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Live class not found' },
        { status: 404 }
      );
    }

    // ✅ Check using instructor.id, not session.userId
    if (existingClass.instructorId !== instructor.id) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete your own classes' },
        { status: 403 }
      );
    }

    await prisma.liveClass.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    );
  }
}

// Update a live class (Instructor only)
export async function PATCH(
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
        { error: 'Unauthorized: Only instructors can update classes' }, 
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
    const body = await req.json();

    // Verify the class belongs to the instructor
    const existingClass = await prisma.liveClass.findUnique({
      where: { id },
    });

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Live class not found' },
        { status: 404 }
      );
    }

    // ✅ Check using instructor.id, not session.userId
    if (existingClass.instructorId !== instructor.id) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only update your own classes' },
        { status: 403 }
      );
    }

    const updatedClass = await prisma.liveClass.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.scheduledAt && { scheduledAt: new Date(body.scheduledAt) }),
        ...(body.duration && { duration: parseInt(body.duration) }),
        ...(body.meetingLink !== undefined && { meetingLink: body.meetingLink }),
        ...(body.maxStudents !== undefined && { 
          maxStudents: body.maxStudents ? parseInt(body.maxStudents) : null 
        }),
        ...(body.status && { status: body.status }),
      },
      include: {
        cohort: {
          select: {
            id: true,
            name: true,
          },
        },
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photoUrl: true,
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

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    );
  }
}