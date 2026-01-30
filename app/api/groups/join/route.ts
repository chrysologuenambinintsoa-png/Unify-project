import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/groups/join - Join a group (from search results)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { groupId } = body;

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }

    // Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    // Check if already a member
    const existingMembership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: groupId,
          userId: session.user.id,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: 'Already a member of this group' },
        { status: 400 }
      );
    }

    // Check if group is private and user is not invited
    if (group.isPrivate) {
      return NextResponse.json(
        { error: 'This is a private group. You need an invitation to join.' },
        { status: 403 }
      );
    }

    // Add user as group member
    const membership = await prisma.groupMember.create({
      data: {
        groupId: groupId,
        userId: session.user.id,
        role: 'member',
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            isPrivate: true,
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

    // Create notification for group admin
    const groupAdmin = await prisma.user.findUnique({
      where: { id: group.adminId },
    });

    if (groupAdmin) {
      await prisma.notification.create({
        data: {
          userId: group.adminId,
          type: 'group_member_joined',
          actorId: session.user.id,
          title: `New Group Member`,
          content: `${session.user.id} joined the group ${group.name}`,
        },
      });
    }

    return NextResponse.json(membership, { status: 201 });
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json(
      { error: 'Failed to join group' },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/join - Leave a group
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }

    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: groupId,
          userId: session.user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Not a member of this group' },
        { status: 404 }
      );
    }

    // Check if user is the admin
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (group?.adminId === session.user.id) {
      return NextResponse.json(
        { error: 'Admin cannot leave the group. Transfer ownership first.' },
        { status: 403 }
      );
    }

    await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId: groupId,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error leaving group:', error);
    return NextResponse.json(
      { error: 'Failed to leave group' },
      { status: 500 }
    );
  }
}
