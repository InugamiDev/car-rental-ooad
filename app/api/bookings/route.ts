import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, AppSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for booking creation
const createBookingSchema = z.object({
  carId: z.string().min(1, 'Car ID is required'),
  startDate: z.string().datetime('Invalid start date format'),
  endDate: z.string().datetime('Invalid end date format'),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  specialRequests: z.string().optional(),
}).refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate']
}).refine(data => {
  const start = new Date(data.startDate);
  const now = new Date();
  return start >= now;
}, {
  message: 'Start date must be in the future',
  path: ['startDate']
});

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
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    
    const where: Record<string, unknown> = { userId: session.user.id };
    if (status) {
      where.status = status;
    }
    
    const [bookings, totalCount] = await Promise.all([
      prisma.rentalBooking.findMany({
        where,
        include: {
          car: {
            select: {
              id: true,
              name: true,
              brand: true,
              normalizedCategory: true,
              images: true,
              costPerDay: true,
            }
          },
          payment: {
            select: {
              id: true,
              amount: true,
              paymentStatus: true,
              paymentMethod: true,
              paymentDate: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rentalBooking.count({ where })
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      bookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit
      }
    });
    
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json(
      { 
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch bookings',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}

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
    
    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);
    
    // Check if car exists and is available for rent
    const car = await prisma.car.findUnique({
      where: { id: validatedData.carId },
      select: {
        id: true,
        name: true,
        costPerDay: true,
        availabilityForRent: true,
        rentalStatus: true,
      }
    });
    
    if (!car) {
      return NextResponse.json(
        { 
          error: {
            code: 'CAR_NOT_FOUND',
            message: 'Car not found',
            details: { carId: validatedData.carId }
          }
        },
        { status: 404 }
      );
    }
    
    if (!car.availabilityForRent || car.rentalStatus !== 'AVAILABLE') {
      return NextResponse.json(
        { 
          error: {
            code: 'CAR_UNAVAILABLE',
            message: 'Car is not available for rental',
            details: { 
              carId: validatedData.carId,
              availabilityForRent: car.availabilityForRent,
              rentalStatus: car.rentalStatus
            }
          }
        },
        { status: 409 }
      );
    }
    
    // Check for conflicting bookings
    const conflictingBookings = await prisma.rentalBooking.findMany({
      where: {
        carId: validatedData.carId,
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
        OR: [
          {
            startDate: { lte: new Date(validatedData.endDate) },
            endDate: { gte: new Date(validatedData.startDate) }
          }
        ]
      }
    });
    
    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { 
          error: {
            code: 'BOOKING_CONFLICT',
            message: 'Car is already booked for the selected dates',
            details: { 
              conflictingBookings: conflictingBookings.map(b => ({
                id: b.id,
                startDate: b.startDate,
                endDate: b.endDate,
                status: b.status
              }))
            }
          }
        },
        { status: 409 }
      );
    }
    
    // Calculate total cost
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalCost = Number(car.costPerDay) * days;
    
    // Create booking
    const booking = await prisma.rentalBooking.create({
      data: {
        userId: session.user.id,
        carId: validatedData.carId,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        pickupLocation: validatedData.pickupLocation,
        dropoffLocation: validatedData.dropoffLocation,
        specialRequests: validatedData.specialRequests,
        totalCost,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            images: true,
            costPerDay: true,
          }
        }
      }
    });
    
    // Generate confirmation number
    const confirmationNumber = `RENT-${new Date().getFullYear()}-${booking.id.slice(-6).toUpperCase()}`;
    
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        ...booking,
        confirmationNumber,
        daysCount: days
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Booking creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid booking data',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              issue: err.message
            }))
          }
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create booking',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}