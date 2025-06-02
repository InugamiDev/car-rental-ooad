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
  if (nameLower.includes('sedan') || nameLower.includes('camry') || nameLower.includes('accord')) return 'SEDAN';
  if (nameLower.includes('suv') || nameLower.includes('everest') || nameLower.includes('fortuner')) return 'SUV';
  if (nameLower.includes('hatchback') || nameLower.includes('city') || nameLower.includes('brio')) return 'HATCHBACK';
  if (nameLower.includes('van') || nameLower.includes('carnival') || nameLower.includes('avanza')) return 'VAN';
  if (nameLower.includes('truck') || nameLower.includes('ranger') || nameLower.includes('triton')) return 'TRUCK';
  if (nameLower.includes('luxury') || nameLower.includes('mercedes') || nameLower.includes('bmw')) return 'LUXURY';
  return 'SEDAN';
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

    // Clear existing cars
    await prisma.car.deleteMany();
    console.log('Cleared existing cars');

    // Transform and insert car data
    for (const rental of rentalData) {
      // Parse price
      const priceMatch = rental.price?.match(/[\d,]+/);
      let dailyPrice = 50; // Default price
      if (priceMatch) {
        const numericPrice = parseInt(priceMatch[0].replace(/,/g, ''));
        if (rental.price.includes('giờ')) {
          dailyPrice = Math.round((numericPrice * 24) / 25000); // Hourly to daily, VND to USD
        } else {
          dailyPrice = Math.round(numericPrice / 25000); // Daily VND to USD
        }
        if (dailyPrice < 25) dailyPrice = 25; // Minimum price
        if (dailyPrice > 500) dailyPrice = 500; // Maximum price
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
      await prisma.car.create({
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
    }

    console.log('Successfully seeded the database');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch(console.error);