import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/badges/groups
 * Récupère le nombre d'invitations de groupe en attente
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const count = await prisma.groupMember.count({
      where: {
        userId: userId,
        joinedAt: null // Pas encore accepté
      }
    });

    return NextResponse.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching groups badge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch badge' },
      { status: 500 }
    );
  }
}
