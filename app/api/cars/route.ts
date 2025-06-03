import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build filter conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const transmission = searchParams.get('transmission');
    const fuelType = searchParams.get('fuelType');
    const availability = searchParams.get('availability');
    const passengerCapacity = searchParams.get('passengerCapacity');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    
    if (category) {
      where.normalizedCategory = {
        equals: category.toUpperCase(),
        mode: 'insensitive'
      };
    }
    
    if (minPrice || maxPrice) {
      where.costPerDay = {};
      if (minPrice) where.costPerDay.gte = parseInt(minPrice);
      if (maxPrice) where.costPerDay.lte = parseInt(maxPrice);
    }
    
    if (transmission) {
      where.transmission = {
        equals: transmission,
        mode: 'insensitive'
      };
    }
    
    if (fuelType) {
      where.fuelType = {
        equals: fuelType,
        mode: 'insensitive'
      };
    }
    
    if (availability === 'rent') {
      where.availabilityForRent = true;
    } else if (availability === 'sale') {
      where.availabilityForSale = true;
    }
    
    if (passengerCapacity) {
      where.passengerCapacity = {
        gte: parseInt(passengerCapacity)
      };
    }
    
    if (brand) {
      where.brand = {
        equals: brand,
        mode: 'insensitive'
      };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { normalizedCategory: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Calculate pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Fetch cars with pagination
    const [cars, totalCount] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { availabilityForRent: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          reviews: {
            select: {
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
      }),
      prisma.car.count({ where })
    ]);
    
    // Calculate average ratings
    const carsWithRatings = cars.map(car => {
      const totalRatings = car.reviews.length;
      const avgRating = totalRatings > 0
        ? Math.round(car.reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings * 10) / 10
        : null;
      
      return {
        ...car,
        averageRating: avgRating,
        totalReviews: totalRatings
      };
    });
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      cars: carsWithRatings,
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
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch cars',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new car in database
    const car = await prisma.car.create({
      data: {
        ...body,
        specs: body.specs || [],
        images: body.images || []
      }
    });
    
    return NextResponse.json(
      {
        success: true,
        message: 'Car created successfully',
        car
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Failed to create car',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 400 }
    );
  }
}