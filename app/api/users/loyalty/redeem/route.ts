import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, AppSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { validateRedemption, getRedemptionOptions } from '@/lib/loyalty';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as AppSession;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            details: { action: 'login_required' }
          }
        },
        { status: 401 }
      );
    }
    
    const { redemptionId } = await request.json();
    
    if (!redemptionId) {
      return NextResponse.json(
        { 
          error: {
            code: 'INVALID_REQUEST',
            message: 'Redemption ID is required',
            details: { field: 'redemptionId' }
          }
        },
        { status: 400 }
      );
    }
    
    // Get user's current points
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        loyaltyPoints: true,
        email: true,
        name: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { 
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
            details: { userId: session.user.id }
          }
        },
        { status: 404 }
      );
    }
    
    // Validate redemption
    const validation = validateRedemption(user.loyaltyPoints, redemptionId);
    
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: {
            code: 'REDEMPTION_INVALID',
            message: validation.error || 'Invalid redemption',
            details: { 
              redemptionId,
              currentPoints: user.loyaltyPoints,
              option: validation.option
            }
          }
        },
        { status: 400 }
      );
    }
    
    const redemptionOption = validation.option!;
    
    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct points from user
      const updatedUser = await tx.user.update({
        where: { id: session.user!.id },
        data: {
          loyaltyPoints: {
            decrement: redemptionOption.pointsRequired
          }
        }
      });
      
      // Create loyalty transaction record
      const transaction = await tx.loyaltyPointTransaction.create({
        data: {
          userId: session.user!.id,
          points: -redemptionOption.pointsRequired,
          transactionType: 'REDEEMED',
          description: `Redeemed: ${redemptionOption.label}`
        }
      });
      
      return {
        user: updatedUser,
        transaction,
        redemption: redemptionOption
      };
    });
    
    return NextResponse.json({
      success: true,
      redemption: {
        id: result.transaction.id,
        option: result.redemption,
        pointsDeducted: redemptionOption.pointsRequired,
        remainingPoints: result.user.loyaltyPoints,
        redeemedAt: result.transaction.createdAt
      },
      message: `Successfully redeemed ${redemptionOption.label}!`
    });
    
  } catch (error) {
    console.error('Loyalty redemption error:', error);
    return NextResponse.json(
      { 
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process redemption',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as AppSession;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        },
        { status: 401 }
      );
    }
    
    // Get available redemption options
    const redemptionOptions = getRedemptionOptions();
    
    return NextResponse.json({
      redemptionOptions
    });
    
  } catch (error) {
    console.error('Get redemption options error:', error);
    return NextResponse.json(
      { 
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch redemption options'
        }
      },
      { status: 500 }
    );
  }
}