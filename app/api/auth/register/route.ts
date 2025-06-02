import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for user registration
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  driverLicense: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { 
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email already exists',
            details: { field: 'email', issue: 'Email already registered' }
          }
        },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        address: validatedData.address,
        driverLicense: validatedData.driverLicense,
        loyaltyPoints: 50, // Welcome bonus
        membershipTier: 'BRONZE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        driverLicense: true,
        loyaltyPoints: true,
        membershipTier: true,
        createdAt: true,
      }
    });
    
    // Create welcome bonus loyalty transaction
    await prisma.loyaltyPointTransaction.create({
      data: {
        userId: user.id,
        points: 50,
        transactionType: 'BONUS',
        description: 'Welcome bonus for new member',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              issue: err.message
            }))
          }
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Registration failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}