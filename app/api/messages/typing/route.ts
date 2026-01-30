import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory store for typing status (for production, use Redis)
const typingUsers = new Map<string, { userId: string; expiresAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationPartnerId, isTyping } = body;

    if (!conversationPartnerId) {
      return NextResponse.json({ error: 'conversationPartnerId required' }, { status: 400 });
    }

    const typingKey = `${session.user.id}:${conversationPartnerId}`;
    
    if (isTyping) {
      // Mark user as typing for 3 seconds
      typingUsers.set(typingKey, {
        userId: session.user.id,
        expiresAt: Date.now() + 3000,
      });
    } else {
      typingUsers.delete(typingKey);
    }

    // Return current typing status for this conversation
    const typingKey2 = `${conversationPartnerId}:${session.user.id}`;
    const isPartnerTyping = typingUsers.has(typingKey2) && typingUsers.get(typingKey2)!.expiresAt > Date.now();

    return NextResponse.json({ isPartnerTyping });
  } catch (error) {
    console.error('Error updating typing status:', error);
    return NextResponse.json({ error: 'Failed to update typing status' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationPartnerId = searchParams.get('partnerId');

    if (!conversationPartnerId) {
      return NextResponse.json({ error: 'partnerId required' }, { status: 400 });
    }

    // Clean up expired entries
    for (const [key, value] of typingUsers.entries()) {
      if (value.expiresAt < Date.now()) {
        typingUsers.delete(key);
      }
    }

    const typingKey = `${conversationPartnerId}:${session.user.id}`;
    const isPartnerTyping = typingUsers.has(typingKey) && typingUsers.get(typingKey)!.expiresAt > Date.now();

    return NextResponse.json({ isPartnerTyping });
  } catch (error) {
    console.error('Error checking typing status:', error);
    return NextResponse.json({ error: 'Failed to check typing status' }, { status: 500 });
  }
}
