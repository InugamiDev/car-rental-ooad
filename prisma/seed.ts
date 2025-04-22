import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

async function main() {
  // Create test users
  const adminPassword = await hashPassword('admin123')
  const merchantPassword = await hashPassword('merchant123')
  const userPassword = await hashPassword('user123')

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  const merchant = await prisma.user.upsert({
    where: { email: 'merchant@example.com' },
    update: {},
    create: {
      email: 'merchant@example.com',
      password: merchantPassword,
      name: 'Test Merchant',
      role: 'MERCHANT',
      merchantProfile: {
        create: {
          businessName: 'Premium Auto Rentals',
          verified: true
        }
      }
    }
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Test User',
      role: 'USER',
      licenseNumber: 'DL123456',
      licenseVerified: true
    }
  })

  const merchantId = (await prisma.merchant.findFirst({
    where: { userId: merchant.id }
  }))!.id

  type CarCreateData = {
    merchantId: string
    make: string
    model: string
    year: number
    type: string
    price: number
    rentalPrice: number
    location: string
    coordinates: string
    specifications: string
    images: string
  }

  const carData: CarCreateData[] = [
    {
      merchantId,
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      type: 'SEDAN',
      price: 25000,
      rentalPrice: 75,
      location: 'New York, NY',
      coordinates: JSON.stringify({ lat: 40.7128, lng: -74.0060 }),
      specifications: JSON.stringify({
        color: 'Silver',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        seats: 5,
        mileage: 15000
      }),
      images: 'https://example.com/camry1.jpg,https://example.com/camry2.jpg'
    },
    {
      merchantId,
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      type: 'LUXURY',
      price: 45000,
      rentalPrice: 150,
      location: 'Los Angeles, CA',
      coordinates: JSON.stringify({ lat: 34.0522, lng: -118.2437 }),
      specifications: JSON.stringify({
        color: 'Red',
        transmission: 'Automatic',
        fuelType: 'Electric',
        seats: 5,
        range: '358 miles'
      }),
      images: 'https://example.com/tesla1.jpg,https://example.com/tesla2.jpg'
    }
  ]

  const cars = await Promise.all(
    carData.map(data => prisma.car.create({ data }))
  )

  // Create a sample rental
  const rental = await prisma.rental.create({
    data: {
      userId: user.id,
      carId: cars[0].id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'ACTIVE',
      initialOdometer: 15000,
      totalPrice: 525, // 7 days * $75/day
    }
  })

  console.log({
    admin,
    merchant,
    user,
    cars,
    rental
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })