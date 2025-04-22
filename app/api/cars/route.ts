import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiError, handleApiError, formatCarResponse } from '@/app/api/utils/json'
import { getAuthUser } from '@/lib/auth-check'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract filter parameters
    const type = searchParams.get('type')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const available = searchParams.get('available') === 'true'

    // Build filter object
    const where: any = {
      availability: true, // By default only show available cars
    }

    if (type) where.type = type
    if (location) where.location = location
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) })
      }
    }

    if (available !== undefined) {
      where.availability = available
    }

    const cars = await prisma.car.findMany({
      where,
      include: {
        merchant: {
          select: {
            businessName: true,
            verified: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(cars.map(formatCarResponse))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    if (user.role !== 'MERCHANT') {
      throw new ApiError('Only merchants can create car listings', 403)
    }

    const merchant = await prisma.merchant.findFirst({
      where: { userId: user.userId }
    })

    if (!merchant) {
      throw new ApiError('Merchant profile not found', 404)
    }

    if (!merchant.verified) {
      throw new ApiError('Merchant must be verified to create listings', 403)
    }

    const body = await request.json()
    
    const car = await prisma.car.create({
      data: {
        ...body,
        merchantId: merchant.id,
        specifications: JSON.stringify(body.specifications || {}),
        coordinates: JSON.stringify(body.coordinates || { lat: 0, lng: 0 }),
        images: Array.isArray(body.images) ? body.images.join(',') : body.images
      }
    })

    return NextResponse.json(formatCarResponse(car), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}