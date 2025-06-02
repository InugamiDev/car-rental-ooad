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

// Transform rental data to standardized car format
function transformRentalData(rentalData: any[]) {
  return rentalData.map((rental, index) => {
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
      'Petrol', // Default fuel type
      `${passengerCapacity} Seater`,
      'Air Conditioning',
      'GPS Navigation'
    ];

    return {
      id: `car_${index + 1}`,
      name: rental.name,
      brand: extractBrand(rental.name),
      model: rental.name.split(' ').slice(1).join(' ') || 'Unknown',
      costPerDay: dailyPrice,
      costIfExtend: Math.round(dailyPrice * 0.9), // 10% discount for extensions
      scrapedCarType: rental.scrapedCarType || null,
      normalizedCategory: normalizeCategory(rental.name),
      passengerCapacity,
      luggageCapacity: `${Math.floor(passengerCapacity / 2)} large bags`,
      transmission: rental.gearBox || 'Automatic',
      fuelType: 'Petrol',
      description: `${rental.name} - Perfect for ${normalizeCategory(rental.name).toLowerCase()} driving needs. Comfortable and reliable vehicle.`,
      salePrice: dailyPrice * 365, // Rough sale price estimation
      year: rental.version ? parseInt(rental.version.match(/\d{4}/)?.[0] || '2020') : 2020,
      mileage: Math.floor(Math.random() * 50000) + 10000,
      licensePlate: rental.plate || `ABC-${Math.floor(Math.random() * 1000)}`,
      availabilityForSale: Math.random() > 0.7, // 30% available for sale
      availabilityForRent: true,
      rentalStatus: 'AVAILABLE',
      images: rental['image-src'] ? [rental['image-src']] : [`https://via.placeholder.com/400x300.png?text=${encodeURIComponent(rental.name)}`],
      specs,
      sourceUrl: rental['web-scraper-start-url'] || null,
      averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3-5 star rating
      totalReviews: Math.floor(Math.random() * 50) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Load and transform rental data
    const rentalData = loadRentalData();
    let cars = transformRentalData(rentalData);

    // Apply filters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const transmission = searchParams.get('transmission');
    const fuelType = searchParams.get('fuelType');
    const availability = searchParams.get('availability');
    const passengerCapacity = searchParams.get('passengerCapacity');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');

    // Filter by category
    if (category) {
      cars = cars.filter(car => car.normalizedCategory.toLowerCase() === category.toLowerCase());
    }

    // Filter by price range
    if (minPrice) {
      cars = cars.filter(car => car.costPerDay >= parseInt(minPrice));
    }
    if (maxPrice) {
      cars = cars.filter(car => car.costPerDay <= parseInt(maxPrice));
    }

    // Filter by transmission
    if (transmission) {
      cars = cars.filter(car => car.transmission.toLowerCase() === transmission.toLowerCase());
    }

    // Filter by fuel type
    if (fuelType) {
      cars = cars.filter(car => car.fuelType.toLowerCase() === fuelType.toLowerCase());
    }

    // Filter by availability
    if (availability === 'rent') {
      cars = cars.filter(car => car.availabilityForRent);
    } else if (availability === 'sale') {
      cars = cars.filter(car => car.availabilityForSale);
    }

    // Filter by passenger capacity
    if (passengerCapacity) {
      cars = cars.filter(car => car.passengerCapacity >= parseInt(passengerCapacity));
    }

    // Filter by brand
    if (brand) {
      cars = cars.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      cars = cars.filter(car =>
        car.name.toLowerCase().includes(searchLower) ||
        car.brand.toLowerCase().includes(searchLower) ||
        car.normalizedCategory.toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const totalItems = cars.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCars = cars.slice(startIndex, endIndex);

    return NextResponse.json({
      cars: paginatedCars,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
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
    
    // This would normally create a new car in the database
    // For now, return a placeholder response
    return NextResponse.json(
      {
        success: true,
        message: 'Car created successfully',
        car: {
          id: `car_${Date.now()}`,
          ...body,
          createdAt: new Date().toISOString()
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid car data',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 400 }
    );
  }
}