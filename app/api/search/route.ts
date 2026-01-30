import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/search - Search personnes, groupes, and pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const session = await getServerSession(authOptions);

    if (!query || query.length < 2) {
      return NextResponse.json({
        personnes: [],
        groupes: [],
        pages: [],
      });
    }

    const searchQuery: Prisma.UserWhereInput = {
      OR: [
        { username: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { fullName: { contains: query, mode: Prisma.QueryMode.insensitive } },
      ],
    };

    let results: any = {
      personnes: [],
      groupes: [],
      pages: [],
    };

    // Search personnes (users and friends)
    if (type === 'all' || type === 'personnes') {
      // First get all users matching the search
      const users = await prisma.user.findMany({
        where: searchQuery,
        select: {
          id: true,
          username: true,
          fullName: true,
          avatar: true,
          isVerified: true,
        },
        take: 10,
      });

      // If user is logged in, check friendship status
      if (session?.user?.id) {
        const usersWithFriendship = await Promise.all(
          users.map(async (user) => {
            if (user.id === session.user.id) {
              return { ...user, friendshipStatus: 'self' };
            }

            const friendship = await prisma.friendship.findFirst({
              where: {
                OR: [
                  { user1Id: session.user.id, user2Id: user.id },
                  { user1Id: user.id, user2Id: session.user.id },
                ],
              },
              select: { status: true },
            });

            return {
              ...user,
              friendshipStatus: friendship?.status || 'none',
            };
          })
        );
        results.personnes = usersWithFriendship;
      } else {
        results.personnes = users;
      }
    }

    // Search groupes
    if (type === 'all' || type === 'groupes') {
      const groupeQuery: Prisma.GroupWhereInput = {
        OR: [
          { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: query, mode: Prisma.QueryMode.insensitive } },
        ],
        isPrivate: false, // Only search public groups
      };

      const groups = await prisma.group.findMany({
        where: groupeQuery,
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          adminId: true,
          isPrivate: true,
          members: {
            where: { userId: session?.user?.id },
            select: { userId: true },
          },
        },
        take: 10,
      });

      results.groupes = groups.map((group) => {
        const { members, ...rest } = group;
        return {
          ...rest,
          isMember: members.length > 0,
        };
      });
    }

    // Search pages
    if (type === 'all' || type === 'pages') {
      const pages = await prisma.page.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: query, mode: Prisma.QueryMode.insensitive } },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          coverImage: true,
          category: true,
          isVerified: true,
          members: {
            where: { userId: session?.user?.id },
            select: { userId: true },
          },
        },
        take: 10,
      });

      results.pages = pages.map((page) => {
        const { members, ...rest } = page;
        return {
          ...rest,
          isFollowing: members.length > 0,
        };
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
