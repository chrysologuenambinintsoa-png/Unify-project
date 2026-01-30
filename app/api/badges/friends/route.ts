import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/badges/friends
 * Récupère le nombre de demandes d'amis en attente
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const count = await prisma.friendship.count({
      where: {
        user2Id: userId,
        status: 'pending'
      }
    });

    return NextResponse.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching friend requests badge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch badge' },
      { status: 500 }
    );
  }
}
