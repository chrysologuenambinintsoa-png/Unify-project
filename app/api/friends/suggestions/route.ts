import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/friends/suggestions
 * Retourne les suggestions d'amis basées sur:
 * 1. Les amis des amis de l'utilisateur
 * 2. Les utilisateurs avec les intérêts communs (bio/tags)
 * 3. Excluant les amis existants et les demandes en attente
 * 
 * Paramètres de query:
 * - limit: number (défaut: 20)
 * - offset: number (défaut: 0)
 * 
 * Réponse:
 * {
 *   suggestions: [
 *     {
 *       id: string,
 *       username: string,
 *       fullName: string,
 *       avatar: string,
 *       bio: string,
 *       mutualFriendsCount: number
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

    // Obtenir tous les amis acceptés de l'utilisateur
    const userFriendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { user1Id: userId, status: 'accepted' },
          { user2Id: userId, status: 'accepted' },
        ],
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    });

    // Construire l'ensemble des amis actuels
    const friendIds = new Set<string>();
    userFriendships.forEach((f) => {
      if (f.user1Id === userId) friendIds.add(f.user2Id);
      if (f.user2Id === userId) friendIds.add(f.user1Id);
    });

    // Obtenir toutes les demandes d'amis existantes (envoyées et reçues)
    const existingRequests = await prisma.friendship.findMany({
      where: {
        AND: [
          {
            OR: [
              { user1Id: userId },
              { user2Id: userId },
            ],
          },
          {
            status: {
              in: ['pending', 'declined', 'blocked'],
            },
          },
        ],
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    });

    const requestedUserIds = new Set<string>();
    existingRequests.forEach((r) => {
      if (r.user1Id === userId) requestedUserIds.add(r.user2Id);
      if (r.user2Id === userId) requestedUserIds.add(r.user1Id);
    });

    // Obtenir les amis des amis (suggestions)
    const friendsOfFriends = await prisma.friendship.findMany({
      where: {
        AND: [
          {
            OR: [
              { user1Id: { in: Array.from(friendIds) }, status: 'accepted' },
              { user2Id: { in: Array.from(friendIds) }, status: 'accepted' },
            ],
          },
          {
            AND: [
              {
                NOT: {
                  OR: [
                    { user1Id: userId },
                    { user2Id: userId },
                  ],
                },
              },
            ],
          },
        ],
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    });

    // Compter les amis mutuels pour chaque suggestion
    const suggestionsMap = new Map<
      string,
      { count: number; friendId: string }
    >();

    friendsOfFriends.forEach((f) => {
      let suggestedId: string;

      if (friendIds.has(f.user1Id)) {
        suggestedId = f.user2Id;
      } else {
        suggestedId = f.user1Id;
      }

      if (
        suggestedId !== userId &&
        !friendIds.has(suggestedId) &&
        !requestedUserIds.has(suggestedId)
      ) {
        const current = suggestionsMap.get(suggestedId) || {
          count: 0,
          friendId: suggestedId,
        };
        current.count += 1;
        suggestionsMap.set(suggestedId, current);
      }
    });

    // Trier par nombre d'amis mutuels
    const suggestedUserIds = Array.from(suggestionsMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map((entry) => entry[0]);

    // Obtenir les infos des utilisateurs suggérés
    const suggestions = await prisma.user.findMany({
      where: {
        id: {
          in: suggestedUserIds.slice(offset, offset + limit),
        },
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatar: true,
        bio: true,
      },
    });

    // Ajouter le compte des amis mutuels
    const suggestionsWithMutual = suggestions.map((user) => ({
      ...user,
      mutualFriendsCount: suggestionsMap.get(user.id)?.count || 0,
    }));

    return NextResponse.json({
      suggestions: suggestionsWithMutual,
      total: suggestedUserIds.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching friend suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friend suggestions' },
      { status: 500 }
    );
  }
}
