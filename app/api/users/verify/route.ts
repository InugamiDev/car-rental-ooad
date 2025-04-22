import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiError, handleApiError } from '@/app/api/utils/json'
import { getAuthUser } from '@/lib/auth-check'

interface VerificationRequest {
  type: 'LICENSE' | 'BUSINESS_REGISTRATION'
  documentUrl: string // URL to uploaded document
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const body: VerificationRequest = await request.json()
    const { type, documentUrl } = body

    if (!type || !documentUrl) {
      throw new ApiError('Missing required fields', 400)
    }

    // Validate document type based on user role
    if (type === 'BUSINESS_REGISTRATION' && user.role !== 'MERCHANT') {
      throw new ApiError('Only merchants can submit business registration', 403)
    }

    if (type === 'LICENSE' && user.role === 'MERCHANT') {
      throw new ApiError('Merchants should submit business registration instead', 400)
    }

    // Create verification document
    const verificationDoc = await prisma.verificationDoc.create({
      data: {
        userId: user.userId,
        type,
        documentUrl,
        verified: false // Admin will verify manually
      }
    })

    return NextResponse.json(verificationDoc, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

// Admin only route to approve/reject verifications
export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    if (user.role !== 'ADMIN') {
      throw new ApiError('Only admins can verify documents', 403)
    }

    const body = await request.json()
    const { documentId, approved } = body

    if (!documentId || approved === undefined) {
      throw new ApiError('Missing required fields', 400)
    }

    const doc = await prisma.verificationDoc.findUnique({
      where: { id: documentId },
      include: {
        user: true
      }
    })

    if (!doc) {
      throw new ApiError('Document not found', 404)
    }

    // Update verification status
    const result = await prisma.$transaction(async (tx) => {
      // Update document status
      const updatedDoc = await tx.verificationDoc.update({
        where: { id: documentId },
        data: { verified: approved }
      })

      // Update user or merchant verification status based on document type
      if (doc.type === 'LICENSE') {
        await tx.user.update({
          where: { id: doc.userId },
          data: { licenseVerified: approved }
        })
      } else if (doc.type === 'BUSINESS_REGISTRATION') {
        await tx.merchant.update({
          where: { userId: doc.userId },
          data: { verified: approved }
        })
      }

      return updatedDoc
    })

    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}

// Get verification status
export async function GET(request: Request) {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      throw new ApiError('Unauthorized', 401)
    }

    const documents = await prisma.verificationDoc.findMany({
      where: {
        userId: user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    return handleApiError(error)
  }
}