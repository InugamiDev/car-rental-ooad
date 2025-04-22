import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiError, handleApiError, formatRentalResponse } from '@/app/api/utils/json'
import { getAuthUser } from '@/lib/auth-check'

// Points earned per kilometer driven
const POINTS_PER_KM = 1

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const rental = await prisma.rental.findUnique({
      where: { id: params.id },
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

    if (!rental) {
      throw new ApiError('Rental not found', 404)
    }

    // Only allow users to view their own rentals or merchants to view rentals of their cars
    if (rental.userId !== user.userId && !user.role.includes('MERCHANT')) {
      throw new ApiError('You are not authorized to view this rental', 403)
    }

    return NextResponse.json(formatRentalResponse(rental))
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

    const body = await request.json()
    const { status, finalOdometer } = body

    // Start transaction to handle rental completion and points
    const result = await prisma.$transaction(async (tx) => {
      const rental = await tx.rental.findUnique({
        where: { id: params.id },
        include: {
          car: {
            include: {
              merchant: true
            }
          }
        }
      })

      if (!rental) {
        throw new ApiError('Rental not found', 404)
      }

      // Verify authorization
      if (rental.userId !== user.userId && rental.car.merchant.userId !== user.userId) {
        throw new ApiError('You are not authorized to update this rental', 403)
      }

      // Validate status transition
      if (!isValidStatusTransition(rental.status, status)) {
        throw new ApiError(`Invalid status transition from ${rental.status} to ${status}`, 400)
      }

      // If completing the rental, calculate and award points
      if (status === 'COMPLETED') {
        if (!finalOdometer) {
          throw new ApiError('Final odometer reading is required to complete rental', 400)
        }

        const distanceDriven = finalOdometer - rental.initialOdometer
        
        if (distanceDriven < 0) {
          throw new ApiError('Final odometer reading cannot be less than initial reading', 400)
        }

        const pointsEarned = Math.floor(distanceDriven * POINTS_PER_KM)

        // Update user's points balance
        await tx.user.update({
          where: { id: rental.userId },
          data: {
            pointsBalance: {
              increment: pointsEarned
            }
          }
        })

        // Create points history record
        await tx.pointsHistory.create({
          data: {
            userId: rental.userId,
            points: pointsEarned,
            type: 'EARNED',
            rentalId: rental.id
          }
        })

        // Update rental with final details
        const updatedRental = await tx.rental.update({
          where: { id: params.id },
          data: {
            status,
            finalOdometer,
            pointsEarned
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
          where: { id: rental.carId },
          data: {
            availability: true
          }
        })

        return updatedRental
      }

      // For other status updates
      return await tx.rental.update({
        where: { id: params.id },
        data: { status },
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
    })

    return NextResponse.json(formatRentalResponse(result))
  } catch (error) {
    return handleApiError(error)
  }
}

function isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
  const validTransitions: Record<string, string[]> = {
    'PENDING': ['ACTIVE', 'CANCELLED'],
    'ACTIVE': ['COMPLETED', 'CANCELLED'],
    'COMPLETED': [],
    'CANCELLED': []
  }

  return validTransitions[currentStatus]?.includes(newStatus) ?? false
}