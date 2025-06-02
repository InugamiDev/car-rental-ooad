import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Sample rental data from mockData/rental.json
const rentalData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'mockData/rental.json'), 'utf-8')
);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clean existing data
    console.log('🧹 Cleaning existing data...');
    await prisma.maintenanceRecord.deleteMany();
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.loyaltyPointTransaction.deleteMany();
    await prisma.salesInquiry.deleteMany();
    await prisma.rentalBooking.deleteMany();
    await prisma.car.deleteMany();
    await prisma.user.deleteMany();

    // Create sample users
    console.log('👥 Creating sample users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@carrental.com',
          name: 'Admin User',
          password: hashedPassword,
          phone: '+1234567890',
          address: '123 Admin Street, City, State 12345',
          driverLicense: 'ADM123456789',
          loyaltyPoints: 1000,
          membershipTier: 'PLATINUM',
        },
      }),
      prisma.user.create({
        data: {
          email: 'john.doe@example.com',
          name: 'John Doe',
          password: hashedPassword,
          phone: '+1234567891',
          address: '456 Customer Lane, City, State 12345',
          driverLicense: 'JD987654321',
          loyaltyPoints: 250,
          membershipTier: 'SILVER',
        },
      }),
      prisma.user.create({
        data: {
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          password: hashedPassword,
          phone: '+1234567892',
          address: '789 Rental Road, City, State 12345',
          driverLicense: 'JS555666777',
          loyaltyPoints: 500,
          membershipTier: 'GOLD',
        },
      }),
      prisma.user.create({
        data: {
          email: 'bob.wilson@example.com',
          name: 'Bob Wilson',
          password: hashedPassword,
          phone: '+1234567893',
          address: '321 Driver Drive, City, State 12345',
          driverLicense: 'BW111222333',
          loyaltyPoints: 50,
          membershipTier: 'BRONZE',
        },
      }),
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Transform and create cars from rental data
    console.log('🚗 Creating cars from rental data...');
    
    const cars = [];
    for (const rental of rentalData.slice(0, 50)) { // Take first 50 cars to avoid overwhelming
      try {
        // Parse price from Vietnamese format
        const priceMatch = rental.price.match(/[\d,]+/);
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

        const car = await prisma.car.create({
          data: {
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
            scrapeTimestamp: new Date(),
          },
        });

        cars.push(car);
      } catch (error) {
        console.warn(`⚠️ Failed to create car: ${rental.name}`, error);
      }
    }

    console.log(`✅ Created ${cars.length} cars`);

    // Create sample bookings
    console.log('📅 Creating sample bookings...');
    const bookings = [];
    
    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const car = cars[Math.floor(Math.random() * cars.length)];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 7) + 1);
      
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalCost = Number(car.costPerDay) * days;

      const booking = await prisma.rentalBooking.create({
        data: {
          userId: user.id,
          carId: car.id,
          startDate,
          endDate,
          pickupLocation: 'Downtown Office',
          dropoffLocation: Math.random() > 0.5 ? 'Airport Terminal' : 'Downtown Office',
          totalCost,
          drivingDistance: Math.floor(Math.random() * 500) + 50,
          distanceExchange: Math.random() > 0.7 ? Math.floor(Math.random() * 50) : null,
          status: ['PENDING', 'CONFIRMED', 'COMPLETED'][Math.floor(Math.random() * 3)] as any,
          paymentStatus: 'COMPLETED',
        },
      });

      bookings.push(booking);
    }

    console.log(`✅ Created ${bookings.length} bookings`);

    // Create sample sales inquiries
    console.log('💼 Creating sample sales inquiries...');
    const salesInquiries = [];

    for (let i = 0; i < 5; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const car = cars.filter(c => c.availabilityForSale)[Math.floor(Math.random() * cars.filter(c => c.availabilityForSale).length)];
      
      if (car) {
        const inquiry = await prisma.salesInquiry.create({
          data: {
            userId: user.id,
            carId: car.id,
            inquiryType: ['PURCHASE', 'TRADE_IN', 'FINANCING', 'TEST_DRIVE'][Math.floor(Math.random() * 4)] as any,
            message: `Interested in purchasing the ${car.name}. Please contact me with more details.`,
            contactPreference: Math.random() > 0.5 ? 'EMAIL' : 'PHONE',
            phoneNumber: user.phone,
            status: ['NEW', 'CONTACTED', 'IN_PROGRESS'][Math.floor(Math.random() * 3)] as any,
            followUpDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
          },
        });

        salesInquiries.push(inquiry);
      }
    }

    console.log(`✅ Created ${salesInquiries.length} sales inquiries`);

    // Create loyalty point transactions
    console.log('🎯 Creating loyalty point transactions...');
    const loyaltyTransactions = [];

    for (const user of users) {
      // Initial welcome bonus
      const welcomeTransaction = await prisma.loyaltyPointTransaction.create({
        data: {
          userId: user.id,
          points: 50,
          transactionType: 'BONUS',
          description: 'Welcome bonus for new member',
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      });

      loyaltyTransactions.push(welcomeTransaction);

      // Booking completion points
      const userBookings = bookings.filter(b => b.userId === user.id && b.status === 'COMPLETED');
      for (const booking of userBookings) {
        const pointsEarned = Math.floor(Number(booking.totalCost) / 10); // 1 point per $10 spent
        const earnedTransaction = await prisma.loyaltyPointTransaction.create({
          data: {
            userId: user.id,
            points: pointsEarned,
            transactionType: 'EARNED',
            description: `Points earned from rental booking`,
            relatedBookingId: booking.id,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });

        loyaltyTransactions.push(earnedTransaction);
      }
    }

    console.log(`✅ Created ${loyaltyTransactions.length} loyalty transactions`);

    // Create sample reviews
    console.log('⭐ Creating sample reviews...');
    const reviews = [];

    for (let i = 0; i < 15; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const car = cars[Math.floor(Math.random() * cars.length)];
      const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
      
      const comments = [
        'Excellent car, very comfortable and clean!',
        'Great service and smooth rental process.',
        'Perfect for our family trip. Highly recommended.',
        'Good value for money. Will rent again.',
        'Nice car but could use better maintenance.',
        'Outstanding experience from start to finish.',
        'Reliable and fuel-efficient vehicle.',
        'Spacious and well-maintained car.',
      ];

      const review = await prisma.review.create({
        data: {
          userId: user.id,
          carId: car.id,
          rating,
          comment: comments[Math.floor(Math.random() * comments.length)],
          isVerified: Math.random() > 0.3, // 70% verified reviews
        },
      });

      reviews.push(review);
    }

    console.log(`✅ Created ${reviews.length} reviews`);

    // Create sample maintenance records
    console.log('🔧 Creating maintenance records...');
    const maintenanceRecords = [];

    for (let i = 0; i < 20; i++) {
      const car = cars[Math.floor(Math.random() * cars.length)];
      const maintenanceTypes = ['Oil Change', 'Tire Rotation', 'Brake Inspection', 'Engine Tune-up', 'Air Filter Replacement'];
      const maintenanceType = maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)];
      
      const maintenanceDate = new Date();
      maintenanceDate.setDate(maintenanceDate.getDate() - Math.floor(Math.random() * 90));
      
      const nextDueDate = new Date(maintenanceDate);
      nextDueDate.setDate(nextDueDate.getDate() + Math.floor(Math.random() * 180) + 30);

      const record = await prisma.maintenanceRecord.create({
        data: {
          carId: car.id,
          maintenanceType,
          description: `Regular ${maintenanceType.toLowerCase()} service performed`,
          cost: Math.floor(Math.random() * 300) + 50,
          performedBy: 'Auto Service Center',
          maintenanceDate,
          nextDueDate,
        },
      });

      maintenanceRecords.push(record);
    }

    console.log(`✅ Created ${maintenanceRecords.length} maintenance records`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Summary:
- Users: ${users.length}
- Cars: ${cars.length}
- Bookings: ${bookings.length}
- Sales Inquiries: ${salesInquiries.length}
- Loyalty Transactions: ${loyaltyTransactions.length}
- Reviews: ${reviews.length}
- Maintenance Records: ${maintenanceRecords.length}
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;