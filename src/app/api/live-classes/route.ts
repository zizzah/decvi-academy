// app/api/live-classes/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-helpers';
import { LiveClassStatus } from '@prisma/client';

interface CreateLiveClassBody {
  title: string;
  description?: string;
  courseId?: string; // ✅ Make this optional
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
    const userRole = session.role;
    
    interface WhereClause {
      instructorId?: string;
      enrollments?: {
        some: {
          studentId: string;
        };
      };
      status?: LiveClassStatus;
      cohortId?: string;
    }

    const whereClause: WhereClause = {};

    // Instructors see their own classes
    if (userRole === 'INSTRUCTOR') {
      // ✅ Get instructor record using userId
      const instructor = await prisma.instructor.findUnique({
        where: { userId: session.userId }
      });

      if (!instructor) {
        return NextResponse.json(
          { error: 'Instructor profile not found' },
          { status: 404 }
        );
      }

      whereClause.instructorId = instructor.id; // Use instructor.id, not userId
    }
    // Students see classes they're enrolled in
    else if (userRole === 'STUDENT') {
      // ✅ Get student record using userId
      const student = await prisma.student.findUnique({
        where: { userId: session.userId }
      });

      if (!student) {
        return NextResponse.json(
          { error: 'Student profile not found' },
          { status: 404 }
        );
      }

      whereClause.enrollments = {
        some: {
          studentId: student.id, // Use student.id, not userId
        },
      };
    }

    if (status) {
      whereClause.status = status as LiveClassStatus;
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




// Create a new live class (Instructor only)
export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    
    console.log('POST /api/live-classes - Session:', session);
    
    if (!session?.userId) {
      console.log('No session found - auth-token cookie missing or invalid');
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to create a live class' }, 
        { status: 401 }
      );
    }

    if (session.role !== 'INSTRUCTOR') {
      console.log(`User ${session.userId} has role ${session.role}, not Instructor`);
      return NextResponse.json(
        { error: 'Unauthorized: Only instructors can create live classes' }, 
        { status: 403 }
      );
    }

    // Get the instructor record using userId
    const instructor = await prisma.instructor.findUnique({
      where: { userId: session.userId }
    });

    if (!instructor) {
      console.error(`No instructor profile found for user ${session.userId}`);
      return NextResponse.json(
        { error: 'Instructor profile not found. Please complete your profile setup.' },
        { status: 404 }
      );
    }

    const body: CreateLiveClassBody = await req.json();
    
    console.log('=== CREATE LIVE CLASS DEBUG ===');
    console.log('Request body:', JSON.stringify(body, null, 2));
    console.log('==============================');
    
    const {
      title,
      description,
      courseId,
      scheduledAt,
      duration,
      meetingLink,
      maxStudents,
    } = body;

    // ✅ UPDATED: Only title, scheduledAt, and duration are required
    if (!title || !scheduledAt || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: title, scheduledAt, and duration are required' },
        { status: 400 }
      );
    }

    // ✅ NEW: If courseId is provided, validate it exists
    let validatedCohortId: string | null = null;
    
    if (courseId && courseId.trim() !== '') {
      const cohort = await prisma.cohort.findUnique({
        where: { id: courseId }
      });

      if (!cohort) {
        console.error(`Cohort not found with id: ${courseId}`);
        return NextResponse.json(
          { 
            error: 'Course/Cohort not found. Please select a valid course or leave it empty.',
            receivedCourseId: courseId 
          },
          { status: 404 }
        );
      }

      console.log('Cohort found:', cohort.name);
      validatedCohortId = courseId;
    } else {
      console.log('No cohort specified - creating live class without cohort');
    }

    const parsedDuration = typeof duration === 'string' ? parseInt(duration, 10) : duration;
    const parsedMaxStudents = maxStudents 
      ? (typeof maxStudents === 'string' ? parseInt(maxStudents, 10) : maxStudents)
      : null;

    const liveClass = await prisma.liveClass.create({
      data: {
        title,
        description: description || null, // ✅ Already handled as optional
        cohortId: validatedCohortId, // ✅ Can be null
        instructorId: instructor.id,
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

    console.log('Live class created successfully:', liveClass.id);
    return NextResponse.json(liveClass);
  } catch (error) {
    console.error('Error creating live class:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create live class',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
