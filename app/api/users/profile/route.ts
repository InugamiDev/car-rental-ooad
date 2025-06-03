import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, AppSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type UserWithRelations = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    loyaltyPoints: true;
    membershipTier: true;
    rentalBookings: {
      where: {
        status: { in: ['COMPLETED', 'IN_PROGRESS'] };
      };
      select: {
        id: true;
        startDate: true;
        endDate: true;
        drivingDistance: true;
        loyaltyPoints: true;
        car: {
          select: {
            name: true;
            brand: true;
          };
        };
      };
    };
    loyaltyHistory: {
      select: {
        id: true;
        points: true;
        transactionType: true;
        description: true;
        createdAt: true;
      };
    };
  };
}>;
//eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
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

    // Get user profile with loyalty information and rental history
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        loyaltyPoints: true,
        membershipTier: true,
        rentalBookings: {
          where: {
            status: { in: ['COMPLETED', 'IN_PROGRESS'] }
          },
          orderBy: { startDate: 'desc' },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            drivingDistance: true,
            loyaltyPoints: true,
            car: {
              select: {
                name: true,
                brand: true,
              }
            }
          }
        },
        loyaltyHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            points: true,
            transactionType: true,
            description: true,
            createdAt: true
          }
        }
      }
    }) as UserWithRelations | null;

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
            details: { userId: session.user.id }
          }
        },
        { status: 404 }
      );
    }

    // Get tier thresholds
    const tiers = {
      BRONZE: 0,
      SILVER: 500,
      GOLD: 1500,
      PLATINUM: 3000
    } as const;

    // Calculate next tier information
    const currentTierIndex = Object.keys(tiers).indexOf(user.membershipTier);
    const tierNames = Object.keys(tiers);
    const nextTier = currentTierIndex < tierNames.length - 1 ? tierNames[currentTierIndex + 1] : null;
    const nextTierThreshold = nextTier ? tiers[nextTier as keyof typeof tiers] : null;
    const pointsToNextTier = nextTierThreshold ? nextTierThreshold - user.loyaltyPoints : 0;

    // Format rental history
    const rentalHistory = user.rentalBookings.map(booking => ({
      id: booking.id,
      description: `${booking.car.brand} ${booking.car.name}`,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      distanceKm: booking.drivingDistance || 0,
      pointsEarned: booking.loyaltyPoints || 0
    }));

    // Format loyalty transactions
    const recentTransactions = user.loyaltyHistory.map(transaction => ({
      id: transaction.id,
      points: transaction.points,
      transactionType: transaction.transactionType,
      description: transaction.description,
      createdAt: transaction.createdAt.toISOString()
    }));

    return NextResponse.json({
      profile: {
        name: user.name || 'Valued Customer',
        email: user.email,
        loyaltyPoints: user.loyaltyPoints,
        membershipTier: user.membershipTier,
        nextTier,
        pointsToNextTier,
        rentalHistory,
        recentTransactions
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch user profile',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}