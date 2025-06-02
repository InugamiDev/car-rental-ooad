import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, AppSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateLoyaltyPoints } from '@/lib/loyalty';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Get booking
    const booking = await prisma.rentalBooking.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: true,
      }
    });
    
    if (!booking) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Booking not found',
            details: { bookingId: params.id }
          }
        },
        { status: 404 }
      );
    }
    
    // Verify booking belongs to user
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied',
            details: { bookingId: params.id }
          }
        },
        { status: 403 }
      );
    }
    
    // Calculate loyalty points based on distance
    const distance = booking.drivingDistance || 0;
    const loyaltyResult = calculateLoyaltyPoints(distance);
    
    // Start a transaction to update booking and user
    const result = await prisma.$transaction(async (tx) => {
      // Update booking status and points
      const updatedBooking = await tx.rentalBooking.update({
        where: { id: booking.id },
        data: {
          status: 'COMPLETED',
          loyaltyPoints: loyaltyResult.points,
        }
      });
      
      // Create loyalty transaction
      const loyaltyTransaction = await tx.loyaltyPointTransaction.create({
        data: {
          userId: booking.userId,
          points: loyaltyResult.points,
          transactionType: 'EARNED',
          description: `Earned from trip - ${distance}km journey`,
          relatedBookingId: booking.id,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
        }
      });
      
      // Update user's total points
      const updatedUser = await tx.user.update({
        where: { id: booking.userId },
        data: {
          loyaltyPoints: {
            increment: loyaltyResult.points
          }
        }
      });
      
      return {
        booking: updatedBooking,
        loyaltyTransaction,
        userPoints: updatedUser.loyaltyPoints,
      };
    });
    
    return NextResponse.json({
      success: true,
      message: 'Booking completed successfully',
      data: {
        bookingId: result.booking.id,
        pointsEarned: loyaltyResult.points,
        totalPoints: result.userPoints,
        tier: loyaltyResult.tier,
      }
    });
    
  } catch (error) {
    console.error('Error completing booking:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to complete booking',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}