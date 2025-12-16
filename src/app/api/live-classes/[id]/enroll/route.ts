// app/api/live-classes/[id]/enroll/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-helpers';
// Add to TOP of each file (before imports):
export const dynamic = 'force-dynamic';

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

    if (session.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can enroll in classes' }, 
        { status: 403 }
      );
    }

    // ✅ Get the student record
    const student = await prisma.student.findUnique({
      where: { userId: session.userId }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    const { id } = await params;

    // Check if class exists
    const liveClass = await prisma.liveClass.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!liveClass) {
      return NextResponse.json(
        { error: 'Live class not found' },
        { status: 404 }
      );
    }

    // Check if class is full
    if (liveClass.maxStudents && liveClass._count.enrollments >= liveClass.maxStudents) {
      return NextResponse.json(
        { error: 'Class is full' },
        { status: 400 }
      );
    }

    // Check if already enrolled - ✅ Use student.id
    const existingEnrollment = await prisma.liveClassEnrollment.findFirst({
      where: {
        liveClassId: id,
        studentId: student.id,
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this class' },
        { status: 400 }
      );
    }

    // Create enrollment - ✅ Use student.id
    const enrollment = await prisma.liveClassEnrollment.create({
      data: {
        liveClassId: id,
        studentId: student.id,
      },
      include: {
        liveClass: {
          include: {
            cohort: true,
            instructor: true,
          },
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in class',
      enrollment,
    });
  } catch (error) {
    console.error('Error enrolling in class:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in class' },
      { status: 500 }
    );
  }
}
