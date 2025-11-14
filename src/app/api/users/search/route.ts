import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-helpers';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const role = searchParams.get('role'); // Optional role filter
    const limit = parseInt(searchParams.get('limit') || '20');

    const whereClause: {
      id: {
        not: string;
      };
      isVerified: boolean;
      OR?: Array<{
        student?: {
          firstName?: {
            contains: string;
            mode: 'insensitive';
          };
          lastName?: {
            contains: string;
            mode: 'insensitive';
          };
        };
        instructor?: {
          firstName?: {
            contains: string;
            mode: 'insensitive';
          };
          lastName?: {
            contains: string;
            mode: 'insensitive';
          };
        };
        admin?: {
          firstName?: {
            contains: string;
            mode: 'insensitive';
          };
          lastName?: {
            contains: string;
            mode: 'insensitive';
          };
        };
        email?: {
          contains: string;
          mode: 'insensitive';
        };
      }>;
      role?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    } = {
      id: {
        not: user.userId, // Exclude current user
      },
      isVerified: true,
    };

    // Add search query filter
    if (query) {
      whereClause.OR = [
        {
          student: {
            firstName: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
        {
          student: {
            lastName: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
        {
          instructor: {
            firstName: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
        {
          instructor: {
            lastName: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
        {
          admin: {
            firstName: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
        {
          admin: {
            lastName: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
        {
          email: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Add role filter if specified
    if (role) {
      whereClause.role = role as 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        role: true,
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        instructor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        admin: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      take: limit,
      orderBy: [
        {
          student: {
            firstName: 'asc',
          },
        },
        {
          instructor: {
            firstName: 'asc',
          },
        },
        {
          admin: {
            firstName: 'asc',
          },
        },
      ],
    });

    // Format the response
    const formattedUsers = users.map((user) => {
      let name = user.email; // Fallback to email

      if (user.student) {
        name = `${user.student.firstName} ${user.student.lastName}`;
      } else if (user.instructor) {
        name = `${user.instructor.firstName} ${user.instructor.lastName}`;
      } else if (user.admin) {
        name = `${user.admin.firstName} ${user.admin.lastName}`;
      }

      return {
        id: user.id,
        name,
        email: user.email,
        role: user.role,
      };
    });

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}
