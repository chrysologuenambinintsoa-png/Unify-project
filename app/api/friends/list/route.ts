import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/friends/list
 * Retourne la liste des amis acceptés de l'utilisateur courant
 * 
 * Paramètres de query:
 * - limit: number (défaut: 20)
 * - offset: number (défaut: 0)
 * - search: string (recherche par nom d'utilisateur ou nom complet)
 * 
 * Réponse:
 * {
 *   friends: [
 *     {
 *       id: string,
 *       username: string,
 *       fullName: string,
 *       avatar: string,
 *       bio: string,
 *       friendSince: string (ISO date)
 *     }
 *   ],
 *   total: number,
 *   limit: number,
 *   offset: number
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';

    // Obtenir le nombre total d'amis
    const total = await prisma.friendship.count({
      where: {
        OR: [
          { user1Id: userId, status: 'accepted' },
          { user2Id: userId, status: 'accepted' },
        ],
      },
    });

    // Obtenir les amis avec pagination et recherche
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { user1Id: userId, status: 'accepted' },
          { user2Id: userId, status: 'accepted' },
        ],
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            bio: true,
          },
        },
        user2: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            bio: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Extraire les amis et appliquer la recherche
    let friends = friendships.map((f) => ({
      user: f.user1Id === userId ? f.user2 : f.user1,
      friendSince: f.createdAt,
    }));

    if (search) {
      const searchLower = search.toLowerCase();
      friends = friends.filter(
        (f) =>
          f.user.username.toLowerCase().includes(searchLower) ||
          f.user.fullName?.toLowerCase().includes(searchLower)
      );
    }

    // Appliquer la pagination
    const paginatedFriends = friends.slice(offset, offset + limit);

    return NextResponse.json({
      friends: paginatedFriends.map((f) => ({
        ...f.user,
        friendSince: f.friendSince.toISOString(),
      })),
      total: search ? friends.length : total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching friends list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friends list' },
      { status: 500 }
    );
  }
}
