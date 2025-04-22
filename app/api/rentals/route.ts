import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiError, handleApiError, formatRentalResponse } from '@/app/api/utils/json'
import { getAuthUser } from '@/lib/auth-check'

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    if (!user.licenseVerified) {
      throw new ApiError('Driver license must be verified before renting', 403)
    }

    const body = await request.json()
    const { carId, startDate, endDate } = body

    if (!carId || !startDate || !endDate) {
      throw new ApiError('Missing required fields', 400)
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      throw new ApiError('End date must be after start date', 400)
    }

    if (start < new Date()) {
      throw new ApiError('Start date cannot be in the past', 400)
    }

    // Check if car exists and is available
    const car = await prisma.car.findUnique({
      where: { id: carId }
    })

    if (!car) {
      throw new ApiError('Car not found', 404)
    }

    if (!car.availability) {
      throw new ApiError('Car is not available for rent', 400)
    }

    // Check for conflicting rentals
    const conflictingRental = await prisma.rental.findFirst({
      where: {
        carId,
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gte: start } }
            ]
          },
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: end } }
            ]
          }
        ],
        status: {
          in: ['PENDING', 'ACTIVE']
        }
      }
    })

    if (conflictingRental) {
      throw new ApiError('Car is not available for the selected dates', 400)
    }

    // Calculate rental duration and total price
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const totalPrice = days * car.rentalPrice

    // Create the rental and update car availability
    const rental = await prisma.$transaction(async (tx) => {
      // Create rental
      const newRental = await tx.rental.create({
        data: {
          userId: user.userId,
          carId,
          startDate: start,
          endDate: end,
          status: 'PENDING',
          totalPrice,
          initialOdometer: car.specifications ? 
            JSON.parse(car.specifications).mileage || 0 : 0,
        },
        include: {
          car: {
            include: {
              merchant: {
                select: {
                  businessName: true,
                  user: {
                    select: {
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          }
        }
      })

      // Update car availability
      await tx.car.update({
        where: { id: carId },
        data: { availability: false }
      })

      return newRental
    })

    return NextResponse.json(formatRentalResponse(rental), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(request: Request) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    // Build filter
    const where: any = { userId: user.userId }
    if (status) {
      where.status = status
    }

    const rentals = await prisma.rental.findMany({
      where,
      include: {
        car: {
          include: {
            merchant: {
              select: {
                businessName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(rentals.map(formatRentalResponse))
  } catch (error) {
    return handleApiError(error)
  }
}