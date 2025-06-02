/**
 * Loyalty Program Core Logic
 * 
 * Core Mandate: Define non-negotiable functional parameters for rental, sales, and loyalty program modules.
 * 
 * Loyalty Program - Earning: The tiered point calculation formula (0-20km: 3*a; 21-50km: 60 + 4*(a-20); 51+km: 180 + 5*(a-50)) is a foundational earning rule.
 * Loyalty Program - Redemption: The defined point redemption options (150pts: $10 off OR 2 extra hours; 250pts: $25 off OR 3 extra hours; 350pts: $50 off OR 3.5 extra hours) are foundational redemption rules.
 */

export interface LoyaltyEarning {
  kilometers: number;
  points: number;
  tier: string;
  formula: string;
}

export interface RedemptionOption {
  id: string;
  pointsRequired: number;
  discountAmount?: number;
  extraHours?: number;
  label: string;
  description: string;
  type: 'discount' | 'extra_hours';
}

export interface LoyaltyTier {
  name: string;
  threshold: number;
  benefits: string[];
  multiplier: number;
  color: string;
  icon: string;
}

/**
 * Calculate loyalty points based on driving distance
 * Formula:
 * - 0-20km: 3 points per km
 * - 21-50km: 60 points + 4 points per km above 20
 * - 51+km: 180 points + 5 points per km above 50
 */
export function calculateLoyaltyPoints(kilometers: number): LoyaltyEarning {
  if (kilometers < 0) {
    throw new Error('Kilometers cannot be negative');
  }

  let points: number;
  let formula: string;
  let tier: string;

  if (kilometers <= 20) {
    // Tier 1: 0-20km = 3 points per km
    points = Math.floor(3 * kilometers);
    formula = `3 × ${kilometers}km = ${points} points`;
    tier = 'bronze';
  } else if (kilometers <= 50) {
    // Tier 2: 21-50km = 60 + 4 points per km above 20
    const extraKm = kilometers - 20;
    points = Math.floor(60 + (4 * extraKm));
    formula = `60 + (4 × ${extraKm}km) = ${points} points`;
    tier = 'silver';
  } else {
    // Tier 3: 51+km = 180 + 5 points per km above 50
    const extraKm = kilometers - 50;
    points = Math.floor(180 + (5 * extraKm));
    formula = `180 + (5 × ${extraKm}km) = ${points} points`;
    tier = 'gold';
  }

  return {
    kilometers,
    points,
    tier,
    formula
  };
}

/**
 * Get all available redemption options
 */
export function getRedemptionOptions(): RedemptionOption[] {
  return [
    {
      id: 'discount_10',
      pointsRequired: 150,
      discountAmount: 10,
      label: '$10 Discount',
      description: 'Get $10 off your next rental',
      type: 'discount'
    },
    {
      id: 'extra_hours_2',
      pointsRequired: 150,
      extraHours: 2,
      label: '2 Extra Hours',
      description: 'Extend your rental by 2 hours at no charge',
      type: 'extra_hours'
    },
    {
      id: 'discount_25',
      pointsRequired: 250,
      discountAmount: 25,
      label: '$25 Discount',
      description: 'Get $25 off your next rental',
      type: 'discount'
    },
    {
      id: 'extra_hours_3',
      pointsRequired: 250,
      extraHours: 3,
      label: '3 Extra Hours',
      description: 'Extend your rental by 3 hours at no charge',
      type: 'extra_hours'
    },
    {
      id: 'discount_50',
      pointsRequired: 350,
      discountAmount: 50,
      label: '$50 Discount',
      description: 'Get $50 off your next rental',
      type: 'discount'
    },
    {
      id: 'extra_hours_3_5',
      pointsRequired: 350,
      extraHours: 3.5,
      label: '3.5 Extra Hours',
      description: 'Extend your rental by 3.5 hours at no charge',
      type: 'extra_hours'
    }
  ];
}

/**
 * Get loyalty tiers with their thresholds and benefits
 */
export function getLoyaltyTiers(): LoyaltyTier[] {
  return [
    {
      name: 'Bronze',
      threshold: 0,
      benefits: [
        'Basic rental discounts',
        'Welcome bonus points',
        'Standard customer support'
      ],
      multiplier: 1.0,
      color: 'amber',
      icon: 'bronze-medal'
    },
    {
      name: 'Silver',
      threshold: 500,
      benefits: [
        '5% rental discount',
        'Priority booking',
        'Extended rental hours',
        'Email support priority'
      ],
      multiplier: 1.1,
      color: 'gray',
      icon: 'silver-medal'
    },
    {
      name: 'Gold',
      threshold: 1500,
      benefits: [
        '10% rental discount',
        'Free upgrades (subject to availability)',
        'VIP customer support',
        'Express check-in/out'
      ],
      multiplier: 1.25,
      color: 'yellow',
      icon: 'gold-medal'
    },
    {
      name: 'Platinum',
      threshold: 3000,
      benefits: [
        '15% rental discount',
        'Guaranteed free upgrades',
        'Concierge service',
        'Exclusive vehicle access',
        '24/7 priority support'
      ],
      multiplier: 1.5,
      color: 'purple',
      icon: 'platinum-medal'
    }
  ];
}

/**
 * Determine user's loyalty tier based on total points
 */
export function getUserTier(totalPoints: number): LoyaltyTier {
  const tiers = getLoyaltyTiers();
  
  // Find the highest tier the user qualifies for
  let userTier = tiers[0]; // Default to Bronze
  
  for (const tier of tiers) {
    if (totalPoints >= tier.threshold) {
      userTier = tier;
    } else {
      break;
    }
  }
  
  return userTier;
}

/**
 * Calculate points needed for next tier
 */
export function getPointsToNextTier(currentPoints: number): { 
  nextTier: LoyaltyTier | null; 
  pointsNeeded: number; 
} {
  const tiers = getLoyaltyTiers();
  const currentTier = getUserTier(currentPoints);
  
  // Find next tier
  const currentTierIndex = tiers.findIndex(tier => tier.name === currentTier.name);
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;
  
  if (!nextTier) {
    return { nextTier: null, pointsNeeded: 0 };
  }
  
  const pointsNeeded = Math.max(0, nextTier.threshold - currentPoints);
  
  return { nextTier, pointsNeeded };
}

/**
 * Validate if user can redeem a specific option
 */
export function canRedeem(userPoints: number, option: RedemptionOption): boolean {
  return userPoints >= option.pointsRequired;
}

/**
 * Get available redemption options for user
 */
export function getAvailableRedemptions(userPoints: number): RedemptionOption[] {
  const allOptions = getRedemptionOptions();
  return allOptions.filter(option => canRedeem(userPoints, option));
}

/**
 * Apply tier multiplier to earned points
 */
export function applyTierMultiplier(basePoints: number, userTotalPoints: number): number {
  const tier = getUserTier(userTotalPoints);
  return Math.floor(basePoints * tier.multiplier);
}

/**
 * Format points for display
 */
export function formatPoints(points: number): string {
  return points.toLocaleString();
}

/**
 * Calculate estimated earnings for a given distance
 */
export function getEstimatedEarnings(kilometers: number, userTotalPoints: number = 0): {
  basePoints: number;
  multipliedPoints: number;
  tier: LoyaltyTier;
  breakdown: LoyaltyEarning;
} {
  const breakdown = calculateLoyaltyPoints(kilometers);
  const tier = getUserTier(userTotalPoints);
  const basePoints = breakdown.points;
  const multipliedPoints = applyTierMultiplier(basePoints, userTotalPoints);
  
  return {
    basePoints,
    multipliedPoints,
    tier,
    breakdown
  };
}

/**
 * Validate redemption request
 */
export function validateRedemption(
  userPoints: number, 
  redemptionId: string
): { valid: boolean; error?: string; option?: RedemptionOption } {
  const option = getRedemptionOptions().find(opt => opt.id === redemptionId);
  
  if (!option) {
    return { valid: false, error: 'Invalid redemption option' };
  }
  
  if (!canRedeem(userPoints, option)) {
    return { 
      valid: false, 
      error: `Insufficient points. Need ${option.pointsRequired}, have ${userPoints}`,
      option 
    };
  }
  
  return { valid: true, option };
}