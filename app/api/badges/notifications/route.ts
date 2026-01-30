import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/badges/notifications
 * Récupère le nombre de notifications non lues
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const count = await prisma.notification.count({
      where: {
        userId: userId,
        isRead: false
      }
    });

    return NextResponse.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching notifications badge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch badge' },
      { status: 500 }
    );
  }
}
