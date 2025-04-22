import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

// Points to discount conversion rate (e.g., 100 points = $1)
const POINTS_TO_CURRENCY = 0.01

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's points balance and history
    const [user, pointsHistory] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          pointsBalance: true
        }
      }),
      prisma.pointsHistory.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      })
    ])

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      balance: user.pointsBalance,
      history: pointsHistory
    })
  } catch (error) {
    console.error('Error fetching points:', error)
    return NextResponse.json(
      { error: 'Failed to fetch points information' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, points, type, rentalId } = body

    // Start transaction to handle points redemption
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: {
          pointsBalance: true
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      if (type === 'SPENT' && user.pointsBalance < points) {
        throw new Error('Insufficient points balance')
      }

      // Update user's points balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          pointsBalance: {
            ...(type === 'EARNED' && { increment: points }),
            ...(type === 'SPENT' && { decrement: points })
          }
        }
      })

      // Create points history record
      const pointsHistory = await tx.pointsHistory.create({
        data: {
          userId,
          points,
          type,
          ...(rentalId && { rentalId })
        }
      })

      return {
        newBalance: updatedUser.pointsBalance,
        transaction: pointsHistory
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing points transaction:', error)
    if (error instanceof Error && error.message === 'Insufficient points balance') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to process points transaction' },
      { status: 500 }
    )
  }
}