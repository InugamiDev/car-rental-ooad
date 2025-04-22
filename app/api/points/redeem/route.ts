import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiError, handleApiError } from '@/app/api/utils/json'
import { getAuthUser } from '@/lib/auth-check'

// Points to currency conversion (e.g., 100 points = $1)
const POINTS_TO_CURRENCY = 0.01

interface RedeemRequest {
  points: number
  rentalId?: string // Optional: for rental discounts
  type: 'RENTAL_DISCOUNT' | 'RENTAL_EXTENSION' | 'PURCHASE_DISCOUNT'
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const body: RedeemRequest = await request.json()
    const { points, rentalId, type } = body

    if (!points || points <= 0) {
      throw new ApiError('Invalid points amount', 400)
    }

    if (points > user.pointsBalance) {
      throw new ApiError('Insufficient points balance', 400)
    }

    // Handle different redemption types
    const result = await prisma.$transaction(async (tx) => {
      // Deduct points from user's balance
      const updatedUser = await tx.user.update({
        where: { id: user.userId },
        data: {
          pointsBalance: {
            decrement: points
          }
        }
      })

      // Create points history record
      const pointsHistory = await tx.pointsHistory.create({
        data: {
          userId: user.userId,
          points: -points,
          type: 'SPENT',
          rentalId
        }
      })

      let discountAmount = points * POINTS_TO_CURRENCY

      if (type === 'RENTAL_DISCOUNT' || type === 'RENTAL_EXTENSION') {
        if (!rentalId) {
          throw new ApiError('Rental ID is required for rental discounts', 400)
        }

        const rental = await tx.rental.findUnique({
          where: { id: rentalId }
        })

        if (!rental) {
          throw new ApiError('Rental not found', 404)
        }

        if (rental.userId !== user.userId) {
          throw new ApiError('You can only apply discounts to your own rentals', 403)
        }

        if (rental.status !== 'PENDING') {
          throw new ApiError('Can only apply discounts to pending rentals', 400)
        }

        if (type === 'RENTAL_EXTENSION') {
          // Calculate additional days based on points value
          const additionalDays = Math.floor(discountAmount / rental.totalPrice * 7) // Assuming weekly rate
          
          await tx.rental.update({
            where: { id: rentalId },
            data: {
              endDate: new Date(rental.endDate.getTime() + additionalDays * 24 * 60 * 60 * 1000)
            }
          })
        } else {
          // Apply discount to rental price
          await tx.rental.update({
            where: { id: rentalId },
            data: {
              totalPrice: {
                decrement: discountAmount
              }
            }
          })
        }
      }

      return {
        remainingPoints: updatedUser.pointsBalance,
        discountAmount,
        pointsHistory
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}