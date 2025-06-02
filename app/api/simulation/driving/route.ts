import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, AppSession } from '@/lib/auth';
import { z } from 'zod';
import { calculateLoyaltyPoints } from '@/lib/loyalty';

// Validation schema for driving simulation
const simulationSchema = z.object({
  distance: z.number().min(0, 'Distance cannot be negative'),
  drivingStyle: z.enum(['safe', 'normal', 'aggressive']).optional(),
  trafficConditions: z.enum(['light', 'moderate', 'heavy']).optional(),
  timeOfDay: z.enum(['day', 'night']).optional(),
  weather: z.enum(['clear', 'rain', 'snow']).optional()
});

type SimulationFactors = {
  base: number;
  drivingStyle: number;
  traffic: number;
  timeOfDay: number;
  weather: number;
};

function calculateDrivingScore(params: z.infer<typeof simulationSchema>): SimulationFactors {
  const factors: SimulationFactors = {
    base: 1.0,
    drivingStyle: 1.0,
    traffic: 1.0,
    timeOfDay: 1.0,
    weather: 1.0
  };

  // Adjust for driving style
  switch (params.drivingStyle) {
    case 'safe':
      factors.drivingStyle = 1.2; // 20% bonus for safe driving
      break;
    case 'aggressive':
      factors.drivingStyle = 0.8; // 20% penalty for aggressive driving
      break;
    default:
      factors.drivingStyle = 1.0;
  }

  // Adjust for traffic conditions
  switch (params.trafficConditions) {
    case 'light':
      factors.traffic = 1.1; // 10% bonus for light traffic
      break;
    case 'heavy':
      factors.traffic = 0.9; // 10% penalty for heavy traffic
      break;
    default:
      factors.traffic = 1.0;
  }

  // Adjust for time of day
  if (params.timeOfDay === 'night') {
    factors.timeOfDay = 1.15; // 15% bonus for night driving
  }

  // Adjust for weather
  switch (params.weather) {
    case 'rain':
      factors.weather = 1.1; // 10% bonus for rain
      break;
    case 'snow':
      factors.weather = 1.2; // 20% bonus for snow
      break;
    default:
      factors.weather = 1.0;
  }

  return factors;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as AppSession;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            details: { action: 'login_required' }
          }
        },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const validatedData = simulationSchema.parse(body);
    
    // Calculate base loyalty points from distance
    const baseLoyalty = calculateLoyaltyPoints(validatedData.distance);
    
    // Calculate driving factors
    const factors = calculateDrivingScore(validatedData);
    
    // Apply factors to base points
    const totalMultiplier = Object.values(factors).reduce((a, b) => a * b, 1);
    const adjustedPoints = Math.round(baseLoyalty.points * totalMultiplier);
    
    return NextResponse.json({
      simulation: {
        originalPoints: baseLoyalty.points,
        adjustedPoints,
        breakdown: {
          distance: validatedData.distance,
          baseFormula: baseLoyalty.formula,
          factors,
          totalMultiplier: Math.round(totalMultiplier * 100) / 100,
        },
        estimatedTier: baseLoyalty.tier,
        message: getFeedbackMessage(factors)
      }
    });
    
  } catch (error) {
    console.error('Simulation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid simulation parameters',
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
          message: 'Failed to run simulation',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}

function getFeedbackMessage(factors: SimulationFactors): string {
  const messages = [];
  
  if (factors.drivingStyle > 1) {
    messages.push('Great job driving safely!');
  } else if (factors.drivingStyle < 1) {
    messages.push('Consider adopting a safer driving style for more points.');
  }
  
  if (factors.traffic > 1) {
    messages.push('Good choice avoiding heavy traffic.');
  }
  
  if (factors.timeOfDay > 1) {
    messages.push('Extra points earned for night driving.');
  }
  
  if (factors.weather > 1) {
    messages.push('Bonus points for driving in challenging weather!');
  }
  
  return messages.join(' ');
}