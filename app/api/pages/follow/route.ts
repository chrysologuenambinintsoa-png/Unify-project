import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/pages/follow - Follow a page (from search results)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { pageId } = body;

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    // Check if page exists
    const page = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Check if already a member
    const existingMembership = await prisma.pageMember.findUnique({
      where: {
        pageId_userId: {
          pageId: pageId,
          userId: session.user.id,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: 'Already following this page' },
        { status: 400 }
      );
    }

    // Add user as page member
    const membership = await prisma.pageMember.create({
      data: {
        pageId: pageId,
        userId: session.user.id,
        role: 'member',
      },
      include: {
        page: {
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error) {
    console.error('Error following page:', error);
    return NextResponse.json(
      { error: 'Failed to follow page' },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/follow - Unfollow a page
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    const membership = await prisma.pageMember.findUnique({
      where: {
        pageId_userId: {
          pageId: pageId,
          userId: session.user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Not a member of this page' },
        { status: 404 }
      );
    }

    await prisma.pageMember.delete({
      where: {
        pageId_userId: {
          pageId: pageId,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unfollowing page:', error);
    return NextResponse.json(
      { error: 'Failed to unfollow page' },
      { status: 500 }
    );
  }
}
