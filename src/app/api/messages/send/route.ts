//app/api/messages/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-helpers';
import { UserRole } from '@prisma/client';

// Search users for starting a conversation
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const roleParam = searchParams.get('role');
    const role = roleParam ? (roleParam as UserRole) : undefined;

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: user.userId,
            },
          },
          {
            email: { contains: search, mode: 'insensitive' },
          },
          ...(role ? [{ role }] : []),
        ],
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
      take: 20,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}