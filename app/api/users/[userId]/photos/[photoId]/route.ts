import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/users/[userId]/photos/[photoId] - Delete a photo
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ userId: string; photoId: string }> }
) {
  try {
    const { userId, photoId } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if photo exists and belongs to the user
    const photo = await (prisma as any).photoGallery.findUnique({
      where: { id: photoId },
    });

    if (!photo || photo.userId !== userId) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Delete the photo
    await (prisma as any).photoGallery.delete({
      where: { id: photoId },
    });

    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[userId]/photos/[photoId] - Update photo caption
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ userId: string; photoId: string }> }
) {
  try {
    const { userId, photoId } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { caption } = body;

    // Check if photo exists and belongs to the user
    const photo = await (prisma as any).photoGallery.findUnique({
      where: { id: photoId },
    });

    if (!photo || photo.userId !== userId) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Update the photo
    const updatedPhoto = await (prisma as any).photoGallery.update({
      where: { id: photoId },
      data: {
        caption: caption || null,
      },
    });

    return NextResponse.json({ photo: updatedPhoto });
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
