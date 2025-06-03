import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const carId = (await params).id;
    
    // Fetch car from database
    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: {
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            user: {
              select: {
                name: true
              }
            },
            createdAt: true
          }
        }
      }
    });
    
    if (!car) {
      return NextResponse.json(
        {
          error: {
            code: 'CAR_NOT_FOUND',
            message: 'Car not found',
            details: { carId }
          }
        },
        { status: 404 }
      );
    }
    
    // Calculate average rating
    const totalRatings = car.reviews.length;
    const avgRating = totalRatings > 0
      ? Math.round(car.reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings * 10) / 10
      : null;
    
    // Return car with ratings
    const carWithRatings = {
      ...car,
      averageRating: avgRating,
      totalReviews: totalRatings
    };
    
    return NextResponse.json(carWithRatings);
    
  } catch (error) {
    console.error('Error fetching car details:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch car details',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const carId = (await params).id;
    const body = await request.json();
    
    // This would normally update the car in the database
    // For now, return a placeholder response
    return NextResponse.json({
      success: true,
      message: `Car ${carId} updated successfully`,
      car: {
        id: carId,
        ...body,
        updatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update car',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const carId = (await params).id;
    
    // This would normally delete the car from the database
    // For now, return a placeholder response
    return NextResponse.json({
      success: true,
      message: `Car ${carId} deleted successfully`
    });
    
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete car',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}