import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/test/badges
 * Diagnostic endpoint pour tester les badges API
 */
export async function GET(request: NextRequest) {
  try {
    console.log('Testing badges API...');
    
    // Test 1: Check NextAuth session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        status: 'not_authenticated',
        message: 'User is not authenticated',
        session: session
      });
    }

    console.log('✓ Session found for user:', session.user.id);

    // Test 2: Try importing prisma
    let prismaStatus = 'unknown';
    try {
      const { prisma } = await import('@/lib/prisma');
      prismaStatus = 'ok';
      
      // Test 3: Try a simple count query
      console.log('Testing prisma queries...');
      const friendshipCount = await prisma.friendship.count({
        where: {
          user2Id: session.user.id,
          status: 'pending'
        }
      });
      
      console.log('✓ Prisma queries working');
      
      return NextResponse.json({
        success: true,
        status: 'all_systems_operational',
        user_id: session.user.id,
        prisma: prismaStatus,
        sample_query: {
          type: 'friendship',
          result: friendshipCount
        }
      });
    } catch (prismaError) {
      console.error('Prisma error:', prismaError);
      prismaStatus = 'error';
      
      return NextResponse.json({
        success: false,
        status: 'database_error',
        prisma_status: prismaStatus,
        error: prismaError instanceof Error ? prismaError.message : 'Unknown error',
        user_id: session.user.id
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      status: 'test_error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
