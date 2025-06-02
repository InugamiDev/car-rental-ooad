import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, AppSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateLoyaltyPoints, applyTierMultiplier, getUserTier } from '@/lib/loyalty';

interface CompleteBookingBody {
  kilometers?: number;
  actualEndDate?: string;
  notes?: string;
}

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
            message: 'Authentication required'
          }
        },
        { status: 401 }
      );
    }
    
    const bookingId = params.id;
    const body: CompleteBookingBody = await request.json();
    
    // Find the booking
    const booking = await prisma.rentalBooking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            loyaltyPoints: true,
            membershipTier: true
          }
        },
        car: {
          select: {
            id: true,
            name: true,
            brand: true
          }
        }
      }
    });
    
    if (!booking) {
      return NextResponse.json(
        { 
          error: {
            code: 'BOOKING_NOT_FOUND',
            message: 'Booking not found'
          }
        },
        { status: 404 }
      );
    }
    
    // Check if user owns this booking
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { 
          error: {
            code: 'FORBIDDEN',
            message: 'You can only complete your own bookings'
          }
        },
        { status: 403 }
      );
    }
    
    // Check if booking can be completed
    if (booking.status !== 'IN_PROGRESS' && booking.status !== 'CONFIRMED') {
      return NextResponse.json(
        { 
          error: {
            code: 'INVALID_STATUS',
            message: 'Booking cannot be completed in current status',
            details: { currentStatus: booking.status }
          }
        },
        { status: 400 }
      );
    }
    
    // Calculate loyalty points if kilometers are provided
    let loyaltyPointsEarned = 0;
    let loyaltyBreakdown = null;
    
    if (body.kilometers && body.kilometers > 0) {
      // Calculate base points using the loyalty formula
      const pointsCalculation = calculateLoyaltyPoints(body.kilometers);
      
      // Apply tier multiplier
      const currentTier = getUserTier(booking.user.loyaltyPoints);
      loyaltyPointsEarned = applyTierMultiplier(pointsCalculation.points, booking.user.loyaltyPoints);
      
      loyaltyBreakdown = {
        kilometers: body.kilometers,
        basePoints: pointsCalculation.points,
        tierMultiplier: currentTier.multiplier,
        finalPoints: loyaltyPointsEarned,
        formula: pointsCalculation.formula,
        tier: pointsCalculation.tier
      };
    }
    
    // Complete the booking in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update booking status
      const updatedBooking = await tx.rentalBooking.update({
        where: { id: bookingId },
        data: {
          status: 'COMPLETED'
        },
        include: {
          car: {
            select: {
              id: true,
              name: true,
              brand: true
            }
          }
        }
      });
      
      // Update car status back to available
      await tx.car.update({
        where: { id: booking.carId },
        data: {
          rentalStatus: 'AVAILABLE'
        }
      });
      
      // Award loyalty points if applicable
      let loyaltyTransaction = null;
      let updatedUser = null;
      
      if (loyaltyPointsEarned > 0) {
        // Update user's loyalty points
        updatedUser = await tx.user.update({
          where: { id: session.user!.id },
          data: {
            loyaltyPoints: {
              increment: loyaltyPointsEarned
            }
          }
        });
        
        // Create loyalty transaction record
        loyaltyTransaction = await tx.loyaltyPointTransaction.create({
          data: {
            userId: session.user!.id,
            points: loyaltyPointsEarned,
            transactionType: 'EARNED',
            description: `Earned from rental: ${booking.car.name}`,
            relatedBookingId: bookingId
          }
        });
        
        // Check if user should be upgraded to a new tier
        const newTier = getUserTier(updatedUser.loyaltyPoints);
        if (newTier.name.toUpperCase() !== updatedUser.membershipTier) {
          await tx.user.update({
            where: { id: session.user!.id },
            data: {
              membershipTier: newTier.name.toUpperCase() as 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
            }
          });
        }
      }
      
      return {
        booking: updatedBooking,
        loyaltyTransaction,
        loyaltyPointsEarned,
        newLoyaltyBalance: updatedUser?.loyaltyPoints || booking.user.loyaltyPoints
      };
    });
    
    return NextResponse.json({
      success: true,
      message: 'Booking completed successfully',
      booking: result.booking,
      loyaltyReward: loyaltyPointsEarned > 0 ? {
        pointsEarned: loyaltyPointsEarned,
        breakdown: loyaltyBreakdown,
        newBalance: result.newLoyaltyBalance,
        transactionId: result.loyaltyTransaction?.id
      } : null
    });
    
  } catch (error) {
    console.error('Booking completion error:', error);
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