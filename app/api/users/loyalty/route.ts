import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, AppSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  getLoyaltyTiers,
  getUserTier,
  getPointsToNextTier,
  getRedemptionOptions,
  getAvailableRedemptions
} from '@/lib/loyalty';

export async function GET() {
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
    
    // Get user's current loyalty info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        loyaltyPoints: true,
        membershipTier: true,
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
    
    // Get loyalty transactions
    const transactions = await prisma.loyaltyPointTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to recent 50 transactions
      select: {
        id: true,
        points: true,
        transactionType: true,
        description: true,
        relatedBookingId: true,
        expiryDate: true,
        createdAt: true,
      }
    });
    
    // Get loyalty tier information using new system
    const currentTier = getUserTier(user.loyaltyPoints);
    const { nextTier: nextTierInfo, pointsNeeded } = getPointsToNextTier(user.loyaltyPoints);
    const allTiers = getLoyaltyTiers();
    const redemptionOptions = getRedemptionOptions();
    const availableRedemptions = getAvailableRedemptions(user.loyaltyPoints);
    
    return NextResponse.json({
      currentPoints: user.loyaltyPoints,
      membershipTier: currentTier.name.toUpperCase(),
      currentTierInfo: currentTier,
      nextTier: nextTierInfo,
      pointsToNextTier: pointsNeeded,
      transactions,
      allTiers,
      redemptionOptions,
      availableRedemptions,
      // Legacy support
      tierBenefits: allTiers.reduce((acc, tier) => {
        acc[tier.name.toUpperCase()] = tier.benefits;
        return acc;
      }, {} as Record<string, string[]>)
    });
    
  } catch (error) {
    console.error('Loyalty fetch error:', error);
    return NextResponse.json(
      { 
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch loyalty information',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}