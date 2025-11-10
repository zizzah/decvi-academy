



// src/app/api/messages/send/route.ts


//app/api/messages/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Search users for starting a conversation
export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: parseInt(session.user.id),
            },
          },
          {
            OR: [
              { username: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
          ...(role ? [{ role }] : []),
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
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