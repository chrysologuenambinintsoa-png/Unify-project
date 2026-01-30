import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/posts/[postId]/comments/[commentId]/reactions - Get all reactions for a comment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const { postId, commentId } = await params;

    // Verify comment exists and belongs to the post
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.postId !== postId) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Get all reactions for the comment
    const reactions = await prisma.reaction.findMany({
      where: {
        commentId: commentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group reactions by emoji
    const groupedReactions = reactions.reduce((acc, reaction) => {
      const existing = acc.find(r => r.emoji === reaction.emoji);
      if (existing) {
        existing.count += 1;
        existing.users.push(reaction.user);
      } else {
        acc.push({
          emoji: reaction.emoji,
          count: 1,
          users: [reaction.user],
        });
      }
      return acc;
    }, [] as Array<{ emoji: string; count: number; users: any[] }>);

    return NextResponse.json({
      total: reactions.length,
      reactions: groupedReactions,
      allReactions: reactions,
    });
  } catch (error) {
    console.error('Error fetching comment reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reactions' },
      { status: 500 }
    );
  }
}

// POST /api/posts/[postId]/comments/[commentId]/reactions - Add or remove a reaction to a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, commentId } = await params;
    const body = await request.json();
    const { emoji } = body;

    if (!emoji) {
      return NextResponse.json(
        { error: 'Emoji is required' },
        { status: 400 }
      );
    }

    // Verify comment exists and belongs to the post
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.postId !== postId) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        commentId: commentId,
        userId: session.user.id,
        emoji: emoji,
      },
    });

    if (existingReaction) {
      // Remove reaction if it already exists (toggle behavior)
      await prisma.reaction.delete({
        where: { id: existingReaction.id },
      });

      return NextResponse.json({
        message: 'Reaction removed',
        action: 'removed',
      });
    }

    // Create new reaction
    const reaction = await prisma.reaction.create({
      data: {
        emoji,
        commentId: commentId,
        userId: session.user.id,
      },
      include: {
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

    return NextResponse.json(
      {
        message: 'Reaction added',
        action: 'added',
        reaction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding comment reaction:', error);
    return NextResponse.json(
      { error: 'Failed to add reaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[postId]/comments/[commentId]/reactions - Remove a reaction from a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, commentId } = await params;
    const body = await request.json();
    const { emoji } = body;

    if (!emoji) {
      return NextResponse.json(
        { error: 'Emoji is required' },
        { status: 400 }
      );
    }

    const reaction = await prisma.reaction.findFirst({
      where: {
        commentId: commentId,
        userId: session.user.id,
        emoji: emoji,
      },
    });

    if (!reaction) {
      return NextResponse.json(
        { error: 'Reaction not found' },
        { status: 404 }
      );
    }

    await prisma.reaction.delete({
      where: { id: reaction.id },
    });

    return NextResponse.json({ message: 'Reaction deleted' });
  } catch (error) {
    console.error('Error deleting comment reaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete reaction' },
      { status: 500 }
    );
  }
}
