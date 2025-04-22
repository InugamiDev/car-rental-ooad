import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiError, handleApiError, formatCarResponse } from '@/app/api/utils/json'
import { getAuthUser } from '@/lib/auth-check'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const car = await prisma.car.findUnique({
      where: { id: params.id },
      include: {
        merchant: {
          select: {
            businessName: true,
            verified: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        rentals: {
          where: {
            OR: [
              { status: 'PENDING' },
              { status: 'ACTIVE' }
            ]
          },
          select: {
            startDate: true,
            endDate: true
          }
        }
      }
    })

    if (!car) {
      throw new ApiError('Car not found', 404)
    }

    return NextResponse.json(formatCarResponse(car))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const car = await prisma.car.findUnique({
      where: { id: params.id },
      include: {
        merchant: true
      }
    })

    if (!car) {
      throw new ApiError('Car not found', 404)
    }

    if (user.role !== 'MERCHANT' || car.merchant.userId !== user.userId) {
      throw new ApiError('You are not authorized to update this car', 403)
    }

    const body = await request.json()

    const updatedCar = await prisma.car.update({
      where: { id: params.id },
      data: {
        ...body,
        specifications: body.specifications ? JSON.stringify(body.specifications) : undefined,
        coordinates: body.coordinates ? JSON.stringify(body.coordinates) : undefined,
        images: body.images ? (Array.isArray(body.images) ? body.images.join(',') : body.images) : undefined
      }
    })

    return NextResponse.json(formatCarResponse(updatedCar))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const car = await prisma.car.findUnique({
      where: { id: params.id },
      include: {
        merchant: true,
        rentals: {
          where: {
            OR: [
              { status: 'PENDING' },
              { status: 'ACTIVE' }
            ]
          }
        }
      }
    })

    if (!car) {
      throw new ApiError('Car not found', 404)
    }

    if (user.role !== 'MERCHANT' || car.merchant.userId !== user.userId) {
      throw new ApiError('You are not authorized to delete this car', 403)
    }

    if (car.rentals.length > 0) {
      throw new ApiError('Cannot delete a car with active rentals', 400)
    }

    await prisma.car.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}