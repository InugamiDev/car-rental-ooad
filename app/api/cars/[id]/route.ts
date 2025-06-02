import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load rental data from JSON file
function loadRentalData() {
  try {
    const filePath = path.join(process.cwd(), 'mockData/rental.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error loading rental data:', error);
    return [];
  }
}

// Transform single rental item to car format (same logic as in cars/route.ts)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformRentalItem(rental: any, index: number) {
  // Parse price from Vietnamese format
  const priceMatch = rental.price?.match(/[\d,]+/);
  let dailyPrice = 50; // Default price
  if (priceMatch) {
    const numericPrice = parseInt(priceMatch[0].replace(/,/g, ''));
    // Convert from VND to USD (rough conversion) and determine if hourly or daily
    if (rental.price.includes('giờ')) {
      dailyPrice = Math.round((numericPrice * 24) / 25000); // Hourly to daily, VND to USD
    } else {
      dailyPrice = Math.round(numericPrice / 25000); // Daily VND to USD
    }
    if (dailyPrice < 25) dailyPrice = 25; // Minimum price
    if (dailyPrice > 500) dailyPrice = 500; // Maximum price
  }

  // Normalize car category
  const normalizeCategory = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('sedan') || nameLower.includes('camry') || nameLower.includes('accord')) return 'SEDAN';
    if (nameLower.includes('suv') || nameLower.includes('everest') || nameLower.includes('fortuner')) return 'SUV';
    if (nameLower.includes('hatchback') || nameLower.includes('city') || nameLower.includes('brio')) return 'HATCHBACK';
    if (nameLower.includes('van') || nameLower.includes('carnival') || nameLower.includes('avanza')) return 'VAN';
    if (nameLower.includes('truck') || nameLower.includes('ranger') || nameLower.includes('triton')) return 'TRUCK';
    if (nameLower.includes('luxury') || nameLower.includes('mercedes') || nameLower.includes('bmw')) return 'LUXURY';
    return 'SEDAN';
  };

  // Extract brand from name
  const extractBrand = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('toyota')) return 'Toyota';
    if (nameLower.includes('honda')) return 'Honda';
    if (nameLower.includes('ford')) return 'Ford';
    if (nameLower.includes('hyundai') || nameLower.includes('huyndai')) return 'Hyundai';
    if (nameLower.includes('kia')) return 'Kia';
    if (nameLower.includes('mazda')) return 'Mazda';
    if (nameLower.includes('mercedes')) return 'Mercedes-Benz';
    if (nameLower.includes('bmw')) return 'BMW';
    if (nameLower.includes('mitsubishi')) return 'Mitsubishi';
    if (nameLower.includes('nissan')) return 'Nissan';
    if (nameLower.includes('vinfast')) return 'VinFast';
    if (nameLower.includes('suzuki')) return 'Suzuki';
    if (nameLower.includes('peugeot')) return 'Peugeot';
    return 'Unknown';
  };

  // Parse passenger capacity
  const capacityMatch = rental.numberOfSeat?.match(/(\d+)/);
  const passengerCapacity = capacityMatch ? parseInt(capacityMatch[1]) : 5;

  // Generate specifications
  const specs = [
    rental.gearBox || 'Automatic',
    'Petrol',
    `${passengerCapacity} Seater`,
    'Air Conditioning',
    'GPS Navigation'
  ];

  // Generate mock reviews
  const generateMockReviews = () => {
    const reviewTemplates = [
      { rating: 5, comment: 'Excellent car, very comfortable and clean!', userName: 'John D.' },
      { rating: 4, comment: 'Great service and smooth rental process.', userName: 'Sarah M.' },
      { rating: 5, comment: 'Perfect for our family trip. Highly recommended.', userName: 'Mike R.' },
      { rating: 4, comment: 'Good value for money. Will rent again.', userName: 'Lisa K.' },
      { rating: 3, comment: 'Nice car but could use better maintenance.', userName: 'Tom W.' },
      { rating: 5, comment: 'Outstanding experience from start to finish.', userName: 'Emma S.' },
    ];
    
    const numReviews = Math.floor(Math.random() * 4) + 2; // 2-5 reviews
    return reviewTemplates.slice(0, numReviews).map((review, idx) => ({
      id: `review_${index}_${idx}`,
      rating: review.rating,
      comment: review.comment,
      user: { name: review.userName },
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      isVerified: Math.random() > 0.3
    }));
  };

  const reviews = generateMockReviews();
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return {
    id: `car_${index + 1}`,
    name: rental.name,
    brand: extractBrand(rental.name),
    model: rental.name.split(' ').slice(1).join(' ') || 'Unknown',
    costPerDay: dailyPrice,
    costIfExtend: Math.round(dailyPrice * 0.9),
    scrapedCarType: rental.scrapedCarType || null,
    normalizedCategory: normalizeCategory(rental.name),
    passengerCapacity,
    luggageCapacity: `${Math.floor(passengerCapacity / 2)} large bags`,
    transmission: rental.gearBox || 'Automatic',
    fuelType: 'Petrol',
    description: `${rental.name} - Perfect for ${normalizeCategory(rental.name).toLowerCase()} driving needs. This vehicle offers excellent comfort, reliability, and fuel efficiency. Ideal for both city driving and long-distance trips.`,
    salePrice: dailyPrice * 365,
    year: rental.version ? parseInt(rental.version.match(/\d{4}/)?.[0] || '2020') : 2020,
    mileage: Math.floor(Math.random() * 50000) + 10000,
    licensePlate: rental.plate || `ABC-${Math.floor(Math.random() * 1000)}`,
    availabilityForSale: Math.random() > 0.7,
    availabilityForRent: true,
    rentalStatus: 'AVAILABLE',
    images: rental['image-src'] ? [rental['image-src']] : [`https://via.placeholder.com/600x400.png?text=${encodeURIComponent(rental.name)}`],
    specs,
    features: [
      'Advanced Safety Package',
      'Premium Audio System',
      'Air Conditioning',
      'GPS Navigation',
      'Bluetooth Connectivity',
      'USB Charging Ports'
    ],
    sourceUrl: rental['web-scraper-start-url'] || null,
    reviews,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const carId = (await params).id;
    
    // Load rental data
    const rentalData = loadRentalData();
    
    // Extract car index from ID (assuming format car_1, car_2, etc.)
    const carIndex = parseInt(carId.replace('car_', '')) - 1;
    
    if (carIndex < 0 || carIndex >= rentalData.length) {
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
    
    // Transform the rental data item to car format
    const car = transformRentalItem(rentalData[carIndex], carIndex);
    
    return NextResponse.json(car);
    
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