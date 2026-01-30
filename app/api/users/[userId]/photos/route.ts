import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/[userId]/photos - Get user's photo gallery
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'profile', 'cover', 'gallery'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch photos
    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    const photos = await (prisma as any).photoGallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users/[userId]/photos - Upload a new photo
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { url, type, caption } = body;

    if (!url || !type) {
      return NextResponse.json(
        { error: 'URL and type are required' },
        { status: 400 }
      );
    }

    if (!['profile', 'cover', 'gallery'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be: profile, cover, or gallery' },
        { status: 400 }
      );
    }

    // If uploading profile or cover, delete the old one
    if (type === 'profile' || type === 'cover') {
      await (prisma as any).photoGallery.deleteMany({
        where: {
          userId,
          type,
        },
      });
    }

    const photo = await (prisma as any).photoGallery.create({
      data: {
        userId,
        url,
        type,
        caption: caption || null,
      },
    });

    return NextResponse.json({ photo });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
