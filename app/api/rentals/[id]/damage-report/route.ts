import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiError, handleApiError } from '@/app/api/utils/json'
import { getAuthUser } from '@/lib/auth-check'

interface DamageReportRequest {
  description: string
  images: string[] // Array of image URLs
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const rentalId = params.id
    const body: DamageReportRequest = await request.json()
    const { description, images } = body

    if (!description || !images || images.length === 0) {
      throw new ApiError('Description and at least one image are required', 400)
    }

    // Get rental details
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
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

    // Only allow damage reports from the renter or the car owner
    if (rental.userId !== user.userId && rental.car.merchant.userId !== user.userId) {
      throw new ApiError('You are not authorized to submit damage reports for this rental', 403)
    }

    // Create damage report
    const damageReport = await prisma.damageReport.create({
      data: {
        rentalId,
        carId: rental.carId,
        reportedById: user.userId,
        description,
        images: images.join(','),
        status: 'PENDING'
      },
      include: {
        rental: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
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

    return NextResponse.json(damageReport, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const rentalId = params.id
    
    // Get rental details
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
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

    // Only allow viewing damage reports if user is the renter or car owner
    if (rental.userId !== user.userId && rental.car.merchant.userId !== user.userId) {
      throw new ApiError('You are not authorized to view damage reports for this rental', 403)
    }

    const reports = await prisma.damageReport.findMany({
      where: { rentalId },
      include: {
        reportedBy: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reports)
  } catch (error) {
    return handleApiError(error)
  }
}

// Update damage report status (Merchant only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const rentalId = params.id
    const body = await request.json()
    const { reportId, status } = body

    if (!reportId || !status) {
      throw new ApiError('Report ID and status are required', 400)
    }

    const validStatuses = ['PENDING', 'INVESTIGATING', 'RESOLVED', 'REJECTED']
    if (!validStatuses.includes(status)) {
      throw new ApiError('Invalid status', 400)
    }

    const report = await prisma.damageReport.findUnique({
      where: { id: reportId },
      include: {
        car: {
          include: {
            merchant: true
          }
        }
      }
    })

    if (!report) {
      throw new ApiError('Damage report not found', 404)
    }

    // Only allow merchant who owns the car to update report status
    if (report.car.merchant.userId !== user.userId) {
      throw new ApiError('Only the car owner can update damage report status', 403)
    }

    const updatedReport = await prisma.damageReport.update({
      where: { id: reportId },
      data: { status },
      include: {
        reportedBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedReport)
  } catch (error) {
    return handleApiError(error)
  }
}