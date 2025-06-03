import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface RentalData {
  'web-scraper-order': string;
  'web-scraper-start-url': string;
  plate: string;
  numberOfSeat: string;
  gearBox: string;
  price: string;
  name: string;
  'image-src': string;
  version: string;
}

function normalizeCategory(name: string): string {
  const nameLower = name.toLowerCase();
  
  // Luxury brands - check first
  if (nameLower.includes('mercedes') || nameLower.includes('bmw') ||
      nameLower.includes('bentley') || nameLower.includes('volvo')) return 'LUXURY';
  
  // Trucks
  if (nameLower.includes('ranger') || nameLower.includes('raptor') ||
      nameLower.includes('triton')) return 'TRUCK';
  
  // SUVs
  if (nameLower.includes('everest') || nameLower.includes('fortuner') ||
      nameLower.includes('santafe') || nameLower.includes('cx5') ||
      nameLower.includes('cx8') || nameLower.includes('cx-8') ||
      nameLower.includes('seltos') || nameLower.includes('sorento') ||
      nameLower.includes('creta') || nameLower.includes('rx5') ||
      nameLower.includes('outlander') || nameLower.includes('peugeot 3008') ||
      nameLower.includes('peugeot 5008') || nameLower.includes('cx3') ||
      nameLower.includes('2008') || nameLower.includes('t-cross') ||
      nameLower.includes('lux sa') || nameLower.includes('custin')) return 'SUV';
  
  // Vans/MPVs (Multi-purpose vehicles)
  if (nameLower.includes('carnival') || nameLower.includes('avanza') ||
      nameLower.includes('xpander') || nameLower.includes('innova') ||
      nameLower.includes('veloz') || nameLower.includes('rush') ||
      nameLower.includes('ertiga') || nameLower.includes('xl7') ||
      nameLower.includes('carens') || nameLower.includes('caren') ||
      nameLower.includes('stargazer') || nameLower.includes('ventuner')) return 'VAN';
  
  // Hatchbacks
  if (nameLower.includes('brio') || nameLower.includes('city') ||
      nameLower.includes('civic') || nameLower.includes('fadil') ||
      nameLower.includes('mazda 2') || nameLower.includes('mazda 3') ||
      nameLower.includes('raize') || nameLower.includes('mg5') ||
      nameLower.includes('zs') || nameLower.includes('almera')) return 'HATCHBACK';
  
  // Sedans - more specific matching
  if (nameLower.includes('accent') || nameLower.includes('elantra') ||
      nameLower.includes('camry') || nameLower.includes('vios') ||
      nameLower.includes('altis') || nameLower.includes('k3') ||
      nameLower.includes('k5') || nameLower.includes('mazda 6') ||
      nameLower.includes('soluto') || nameLower.includes('lux a') ||
      nameLower.includes('luxa a') || nameLower.includes('s60') ||
      nameLower.includes('cla') || nameLower.includes('c180') ||
      nameLower.includes('c200') || nameLower.includes('c250') ||
      nameLower.includes('c300') || nameLower.includes('e300') ||
      nameLower.includes('420i')) return 'SEDAN';
  
  // Default fallback - analyze by common patterns
  if (nameLower.includes('4 chỗ') || nameLower.includes('sedan')) return 'SEDAN';
  if (nameLower.includes('7 chỗ') || nameLower.includes('8 chỗ')) return 'VAN';
  
  return 'SEDAN'; // Ultimate fallback
}

function extractBrand(name: string): string {
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
}

async function seed() {
  try {
    // Load rental data from JSON file
    const filePath = path.join(process.cwd(), 'mockData/rental.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const rentalData = JSON.parse(jsonData) as RentalData[];

    // Clear existing data in dependency order
    console.log('Clearing existing data...');
    await prisma.loyaltyPointTransaction.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.rentalBooking.deleteMany();
    await prisma.salesInquiry.deleteMany();
    await prisma.review.deleteMany();
    await prisma.maintenanceRecord.deleteMany();
    await prisma.car.deleteMany();
    await prisma.user.deleteMany();
    console.log('Cleared existing data');

    // Create demo users
    console.log('Creating demo users...');
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'john.doe@example.com',
          name: 'John Doe',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // bcrypt hash for 'password'
          phone: '+1234567890',
          address: '123 Main St, City, State 12345',
          driverLicense: 'DL123456789',
          loyaltyPoints: 1500,
          membershipTier: 'GOLD'
        }
      }),
      prisma.user.create({
        data: {
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // bcrypt hash for 'password'
          phone: '+1987654321',
          address: '456 Oak Ave, City, State 67890',
          driverLicense: 'DL987654321',
          loyaltyPoints: 750,
          membershipTier: 'SILVER'
        }
      }),
      prisma.user.create({
        data: {
          email: 'mike.wilson@example.com',
          name: 'Mike Wilson',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // bcrypt hash for 'password'
          phone: '+1122334455',
          address: '789 Pine Rd, City, State 11223',
          driverLicense: 'DL112233445',
          loyaltyPoints: 300,
          membershipTier: 'BRONZE'
        }
      }),
      prisma.user.create({
        data: {
          email: 'admin@carrental.com',
          name: 'Admin User',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // bcrypt hash for 'password'
          phone: '+1555000123',
          address: 'Admin Office, Business District',
          driverLicense: 'DL000000001',
          loyaltyPoints: 5000,
          membershipTier: 'PLATINUM'
        }
      })
    ]);
    console.log(`Created ${users.length} demo users`);

    // Transform and insert car data
    console.log('Creating cars...');
    const cars = [];
    for (const rental of rentalData) {
      // Parse price with proper conversion
      const priceMatch = rental.price?.match(/[\d,.]+/);
      let dailyPrice = 50; // Default price
      if (priceMatch) {
        const numericPrice = parseInt(priceMatch[0].replace(/[,.]/g, ''));
        if (rental.price.includes('giờ')) {
          // Convert hourly to daily rate (VND to USD: ~25,000 VND = 1 USD)
          dailyPrice = Math.round((numericPrice * 24) / 25000);
        } else {
          // Convert daily rate (VND to USD: ~25,000 VND = 1 USD)
          dailyPrice = Math.round(numericPrice / 25000);
        }
        // Apply more realistic bounds to preserve price variety
        if (dailyPrice < 15) dailyPrice = Math.max(15, Math.round(numericPrice / 30000)); // More generous minimum
        if (dailyPrice > 800) dailyPrice = Math.min(800, Math.round(numericPrice / 20000)); // Higher maximum for luxury cars
      }

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

      // Create car record
      const car = await prisma.car.create({
        data: {
          name: rental.name,
          brand: extractBrand(rental.name),
          model: rental.name.split(' ').slice(1).join(' ') || 'Unknown',
          costPerDay: dailyPrice,
          costIfExtend: Math.round(dailyPrice * 0.9),
          normalizedCategory: normalizeCategory(rental.name),
          passengerCapacity,
          luggageCapacity: `${Math.floor(passengerCapacity / 2)} large bags`,
          transmission: rental.gearBox || 'Automatic',
          fuelType: 'Petrol',
          description: `${rental.name} - Perfect for ${normalizeCategory(rental.name).toLowerCase()} driving needs. Comfortable and reliable vehicle.`,
          salePrice: dailyPrice * 365,
          year: rental.version ? parseInt(rental.version.match(/\d{4}/)?.[0] || '2020') : 2020,
          mileage: Math.floor(Math.random() * 50000) + 10000,
          licensePlate: rental.plate,
          availabilityForSale: Math.random() > 0.7,
          availabilityForRent: true,
          rentalStatus: 'AVAILABLE',
          images: rental['image-src'] ? [rental['image-src']] : [`https://via.placeholder.com/400x300.png?text=${encodeURIComponent(rental.name)}`],
          specs,
          sourceUrl: rental['web-scraper-start-url']
        }
      });
      cars.push(car);
    }
    console.log(`Created ${cars.length} cars`);

    // Create sample reviews
    console.log('Creating sample reviews...');
    const reviewsData = [
      { rating: 5, comment: 'Excellent car! Very comfortable and clean.', userId: users[0].id, carId: cars[0].id },
      { rating: 4, comment: 'Good experience overall. Would rent again.', userId: users[1].id, carId: cars[1].id },
      { rating: 5, comment: 'Perfect for our family trip. Highly recommended!', userId: users[2].id, carId: cars[2].id },
      { rating: 4, comment: 'Great value for money. Nice features.', userId: users[0].id, carId: cars[3].id },
      { rating: 5, comment: 'Luxury at its best. Amazing driving experience.', userId: users[1].id, carId: cars[4].id },
      { rating: 3, comment: 'Decent car but could be cleaner.', userId: users[2].id, carId: cars[5].id },
      { rating: 4, comment: 'Reliable and fuel efficient.', userId: users[3].id, carId: cars[6].id },
      { rating: 5, comment: 'Exceeded expectations! Will definitely book again.', userId: users[0].id, carId: cars[7].id }
    ];

    for (const review of reviewsData) {
      await prisma.review.create({
        data: {
          ...review,
          isVerified: true
        }
      });
    }
    console.log(`Created ${reviewsData.length} reviews`);

    // Create sample rental bookings
    console.log('Creating sample rental bookings...');
    const bookingsData = [
      {
        userId: users[0].id,
        carId: cars[0].id,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-05'),
        pickupLocation: 'Downtown Office',
        dropoffLocation: 'Airport Terminal',
        totalCost: Number(cars[0].costPerDay || 0) * 4,
        status: 'COMPLETED' as const,
        paymentStatus: 'COMPLETED' as const,
        loyaltyPoints: 100
      },
      {
        userId: users[1].id,
        carId: cars[1].id,
        startDate: new Date('2024-12-10'),
        endDate: new Date('2024-12-15'),
        pickupLocation: 'Airport Terminal',
        dropoffLocation: 'Downtown Office',
        totalCost: Number(cars[1].costPerDay || 0) * 5,
        status: 'IN_PROGRESS' as const,
        paymentStatus: 'COMPLETED' as const,
        loyaltyPoints: 125
      },
      {
        userId: users[2].id,
        carId: cars[2].id,
        startDate: new Date('2024-12-20'),
        endDate: new Date('2024-12-25'),
        pickupLocation: 'City Center',
        dropoffLocation: 'City Center',
        totalCost: Number(cars[2].costPerDay || 0) * 5,
        status: 'CONFIRMED' as const,
        paymentStatus: 'PENDING' as const,
        loyaltyPoints: 150
      }
    ];

    const bookings = [];
    for (const booking of bookingsData) {
      const rentalBooking = await prisma.rentalBooking.create({
        data: booking
      });
      bookings.push(rentalBooking);
    }
    console.log(`Created ${bookings.length} rental bookings`);

    // Create payments for bookings
    console.log('Creating payments...');
    for (const booking of bookings) {
      if (booking.paymentStatus === 'COMPLETED') {
        await prisma.payment.create({
          data: {
            bookingId: booking.id,
            amount: booking.totalCost,
            paymentMethod: 'CREDIT_CARD',
            paymentStatus: 'COMPLETED',
            transactionId: `txn_${Math.random().toString(36).substring(7)}`,
            paymentDate: new Date()
          }
        });
      }
    }
    console.log('Created payments');

    // Create loyalty point transactions
    console.log('Creating loyalty transactions...');
    const loyaltyTransactions = [
      { userId: users[0].id, points: 100, transactionType: 'EARNED' as const, description: 'Earned from rental booking' },
      { userId: users[0].id, points: 500, transactionType: 'BONUS' as const, description: 'Welcome bonus' },
      { userId: users[1].id, points: 125, transactionType: 'EARNED' as const, description: 'Earned from rental booking' },
      { userId: users[1].id, points: 50, transactionType: 'REDEEMED' as const, description: 'Redeemed for discount' },
      { userId: users[2].id, points: 300, transactionType: 'EARNED' as const, description: 'Multiple rental bonus' },
      { userId: users[3].id, points: 1000, transactionType: 'BONUS' as const, description: 'Admin bonus points' }
    ];

    for (const transaction of loyaltyTransactions) {
      await prisma.loyaltyPointTransaction.create({
        data: transaction
      });
    }
    console.log(`Created ${loyaltyTransactions.length} loyalty transactions`);

    // Create sample sales inquiries
    console.log('Creating sales inquiries...');
    const salesInquiries = [
      {
        userId: users[0].id,
        carId: cars[5].id,
        inquiryType: 'PURCHASE' as const,
        message: 'Interested in buying this car. What\'s the best price?',
        contactPreference: 'Email',
        phoneNumber: users[0].phone,
        status: 'NEW' as const
      },
      {
        userId: users[1].id,
        carId: cars[10].id,
        inquiryType: 'TEST_DRIVE' as const,
        message: 'Would like to schedule a test drive.',
        contactPreference: 'Phone',
        phoneNumber: users[1].phone,
        status: 'CONTACTED' as const
      }
    ];

    for (const inquiry of salesInquiries) {
      await prisma.salesInquiry.create({
        data: inquiry
      });
    }
    console.log(`Created ${salesInquiries.length} sales inquiries`);

    // Create maintenance records
    console.log('Creating maintenance records...');
    const maintenanceRecords = [
      {
        carId: cars[0].id,
        maintenanceType: 'Oil Change',
        description: 'Regular oil change and filter replacement',
        cost: 75,
        performedBy: 'Auto Service Center',
        maintenanceDate: new Date('2024-11-15'),
        nextDueDate: new Date('2025-02-15')
      },
      {
        carId: cars[1].id,
        maintenanceType: 'Tire Rotation',
        description: 'Rotated all four tires for even wear',
        cost: 50,
        performedBy: 'Tire Plus',
        maintenanceDate: new Date('2024-11-20'),
        nextDueDate: new Date('2025-03-20')
      },
      {
        carId: cars[2].id,
        maintenanceType: 'Brake Inspection',
        description: 'Inspected brake pads and fluid levels',
        cost: 125,
        performedBy: 'Brake Masters',
        maintenanceDate: new Date('2024-12-01'),
        nextDueDate: new Date('2025-06-01')
      }
    ];

    for (const record of maintenanceRecords) {
      await prisma.maintenanceRecord.create({
        data: record
      });
    }
    console.log(`Created ${maintenanceRecords.length} maintenance records`);

    console.log('Successfully seeded all database tables!');
    console.log('Summary:');
    console.log(`- ${users.length} users`);
    console.log(`- ${cars.length} cars`);
    console.log(`- ${reviewsData.length} reviews`);
    console.log(`- ${bookings.length} bookings`);
    console.log(`- ${loyaltyTransactions.length} loyalty transactions`);
    console.log(`- ${salesInquiries.length} sales inquiries`);
    console.log(`- ${maintenanceRecords.length} maintenance records`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch(console.error);