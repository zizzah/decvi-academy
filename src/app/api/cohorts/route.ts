export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-helpers';
// Add to TOP of each file (before imports):
export async function GET(req: Request) {
  try {
    const session = await getCurrentUser();

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only instructors and admins can see cohorts for creating classes
    if (session.role !== 'INSTRUCTOR' && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const cohorts = await prisma.cohort.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        maxStudents: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(cohorts);
  } catch (error) {
    console.error('Error fetching cohorts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cohorts' },
      { status: 500 }
    );
  }
}
