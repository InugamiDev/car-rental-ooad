import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, AppSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
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
    
    // Get booking details
    const booking = await prisma.rentalBooking.findUnique({
      where: {
        id: params.id,
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true,
            imageURL: true,
            normalizedCategory: true,
            passengerCapacity: true,
          }
        },
        payment: {
          select: {
            amount: true,
            paymentStatus: true,
            paymentMethod: true,
            paymentDate: true
          }
        }
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
    
    // Verify the booking belongs to the authenticated user
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
    
    // Get estimated loyalty points based on the booking
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return NextResponse.json({
      id: booking.id,
      car: booking.car,
      startDate: booking.startDate,
      endDate: booking.endDate,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      totalCost: booking.totalCost,
      status: booking.status,
      payment: booking.payment,
      daysCount: days,
      createdAt: booking.createdAt
    });
    
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch booking details',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}