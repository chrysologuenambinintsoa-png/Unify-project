import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/friends/badges
 * Retourne les compteurs pour les badges d'affichage:
 * - Nombre de demandes d'amis en attente
 * - Nombre de suggestions d'amis
 * - Nombre total d'amis
 * 
 * Réponse:
 * {
 *   pendingRequests: number,
 *   suggestions: number,
 *   friends: number,
 *   total: number
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Obtenir les demandes d'amis en attente (reçues)
    const pendingRequests = await prisma.friendship.count({
      where: {
        user2Id: userId,
        status: 'pending',
      },
    });

    // Obtenir le nombre d'amis acceptés
    const friendsCount = await prisma.friendship.count({
      where: {
        OR: [
          { user1Id: userId, status: 'accepted' },
          { user2Id: userId, status: 'accepted' },
        ],
      },
    });

    // Obtenir les suggestions d'amis (amis des amis qui ne sont pas encore amis)
    const userFriendIds = await prisma.friendship.findMany({
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

    // Extraire les IDs des amis
    const friendIds = new Set<string>();
    userFriendIds.forEach((f) => {
      if (f.user1Id === userId) friendIds.add(f.user2Id);
      if (f.user2Id === userId) friendIds.add(f.user1Id);
    });

    // Obtenir les amis des amis (suggestions)
    const suggestions = await prisma.friendship.findMany({
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

    // Obtenir les utilisateurs suggérés uniques
    const suggestedUserIds = new Set<string>();
    suggestions.forEach((f) => {
      if (friendIds.has(f.user1Id) && f.user2Id !== userId) {
        suggestedUserIds.add(f.user2Id);
      }
      if (friendIds.has(f.user2Id) && f.user1Id !== userId) {
        suggestedUserIds.add(f.user1Id);
      }
    });

    // Exclure les demandes en attente et les demandes déclinées
    const existingFriendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      select: {
        user1Id: true,
        user2Id: true,
        status: true,
      },
    });

    const blockedOrPendingIds = new Set<string>();
    existingFriendships.forEach((f) => {
      if (f.status !== 'accepted') {
        if (f.user1Id === userId) blockedOrPendingIds.add(f.user2Id);
        else blockedOrPendingIds.add(f.user1Id);
      }
    });

    // Supprimer les utilisateurs bloqués ou avec demandes en attente
    const validSuggestions = Array.from(suggestedUserIds).filter(
      (id) => !blockedOrPendingIds.has(id)
    );

    return NextResponse.json({
      pendingRequests,
      suggestions: validSuggestions.length,
      friends: friendsCount,
      total: pendingRequests + validSuggestions.length + friendsCount,
    });
  } catch (error) {
    console.error('Error fetching friend badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friend badges' },
      { status: 500 }
    );
  }
}
