// app/api/live-classes/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-helpers';

interface CreateLiveClassBody {
  title: string;
  description?: string;
  courseId: string;
  scheduledAt: string;
  duration: string | number;
  meetingLink?: string;
  maxStudents?: string | number | null;
}

// Get all live classes (filtered by role)
export async function GET(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const courseId = searchParams.get('courseId');
    const userId = session.userId;
    const userRole = session.role;

    interface WhereClause {
      instructorId?: string;
      enrollments?: {
        some: {
          studentId: string;
        };
      };
      status?: string;
      cohortId?: string;
    }

    const whereClause: WhereClause = {};

    // Instructors see their own classes
    if (userRole === 'Instructor') {
      whereClause.instructorId = userId;
    }
    // Students see classes they're enrolled in
    else if (userRole === 'Student') {
      whereClause.enrollments = {
        some: {
          studentId: userId,
        },
      };
    }

    if (status) {
      whereClause.status = status;
    }

    if (courseId) {
      whereClause.cohortId = courseId;
    }

    const liveClasses = await prisma.liveClass.findMany({
      where: whereClause,
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
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return NextResponse.json(liveClasses);
  } catch (error) {
    console.error('Error fetching live classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live classes' },
      { status: 500 }
    );
  }
}

// Create a new live class (Instructor only)
export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId || session.role !== 'Instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateLiveClassBody = await req.json();
    const {
      title,
      description,
      courseId,
      scheduledAt,
      duration,
      meetingLink,
      maxStudents,
    } = body;

    // Validate required fields
    if (!title || !courseId || !scheduledAt || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const parsedDuration = typeof duration === 'string' ? parseInt(duration, 10) : duration;
    const parsedMaxStudents = maxStudents 
      ? (typeof maxStudents === 'string' ? parseInt(maxStudents, 10) : maxStudents)
      : null;

    const liveClass = await prisma.liveClass.create({
      data: {
        title,
        description: description || null,
        cohortId: courseId,
        instructorId: session.userId,
        scheduledAt: new Date(scheduledAt),
        duration: parsedDuration,
        meetingLink: meetingLink || null,
        maxStudents: parsedMaxStudents,
        status: 'SCHEDULED',
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

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error('Error creating live class:', error);
    return NextResponse.json(
      { error: 'Failed to create live class' },
      { status: 500 }
    );
  }
}