'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import PointsCalculator from './PointsCalculator';
import {
  Trophy,
  Gift,
  TrendingUp,
  Star,
  Clock,
  DollarSign,
  Award,
  Zap,
  Calculator
} from 'lucide-react';
import { clsx } from 'clsx';
import type { LoyaltyTier, RedemptionOption } from '@/lib/loyalty';

interface LoyaltyTransaction {
  id: string;
  points: number;
  transactionType: 'EARNED' | 'REDEEMED';
  description: string;
  createdAt: string;
  relatedBookingId?: string;
}

interface LoyaltyData {
  currentPoints: number;
  membershipTier: string;
  currentTierInfo: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  pointsToNextTier: number;
  transactions: LoyaltyTransaction[];
  allTiers: LoyaltyTier[];
  redemptionOptions: RedemptionOption[];
  availableRedemptions: RedemptionOption[];
}

const LoyaltyDashboard: React.FC = () => {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rewards' | 'calculator' | 'history'>('overview');
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/loyalty');
      if (!response.ok) {
        throw new Error('Failed to fetch loyalty data');
      }
      const data = await response.json();
      setLoyaltyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return 'warning';
      case 'silver': return 'neutral';
      case 'gold': return 'warning';
      case 'platinum': return 'info';
      default: return 'default';
    }
  };

  const getTierIcon = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return Award;
      case 'silver': return Star;
      case 'gold': return Trophy;
      case 'platinum': return Zap;
      default: return Award;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRedeem = async (redemptionId: string) => {
    try {
      setRedeeming(redemptionId);
      const response = await fetch('/api/users/loyalty/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ redemptionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to redeem points');
      }

      // Show success message (you can replace this with a toast notification)
      alert(`Successfully redeemed ${data.redemption.option.label}!`);
      
      // Refresh loyalty data
      await fetchLoyaltyData();
      
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to redeem points');
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-32 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Card variant="outline" className="text-center">
          <CardContent className="py-12">
            <div className="text-error mb-4">
              <Trophy className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-h3">Unable to load loyalty data</h3>
              <p className="text-body text-muted-foreground mt-2">{error}</p>
            </div>
            <Button variant="primary" onClick={fetchLoyaltyData}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!loyaltyData) return null;

  const progressPercentage = loyaltyData.nextTier 
    ? ((loyaltyData.currentTierInfo.threshold || 0) / loyaltyData.nextTier.threshold) * 100
    : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Loyalty Program</h1>
        <p className="text-lg text-muted-foreground">
          Turn kilometers into amazing rewards!
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'rewards', label: 'Rewards', icon: Gift },
          { id: 'calculator', label: 'Calculator', icon: Calculator },
          { id: 'history', label: 'History', icon: Clock }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedTab(id as 'overview' | 'rewards' | 'calculator' | 'history')}
            className={clsx(
              'flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200',
              selectedTab === id
                ? 'bg-background text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="grid gap-6">
          {/* Current Status */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Points Card */}
            <Card variant="elevated" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Current Points</h3>
                    <p className="text-sm text-muted-foreground">Available for redemption</p>
                  </div>
                  <div className="text-primary">
                    <Trophy className="w-8 h-8" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-h1 font-bold text-primary mb-2">
                  {loyaltyData.currentPoints.toLocaleString()}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getTierColor(loyaltyData.currentTierInfo.name)} size="md">
                    {loyaltyData.currentTierInfo.name} Member
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tier Progress */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-h4">Tier Progress</h3>
                    <p className="text-body-sm text-muted-foreground">
                      {loyaltyData.nextTier 
                        ? `${loyaltyData.pointsToNextTier} points to ${loyaltyData.nextTier.name}`
                        : 'Highest tier achieved!'
                      }
                    </p>
                  </div>
                  {React.createElement(getTierIcon(loyaltyData.currentTierInfo.name), {
                    className: "w-8 h-8 text-primary"
                  })}
                </div>
              </CardHeader>
              <CardContent>
                {loyaltyData.nextTier ? (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between text-body-sm mb-2">
                        <span>{loyaltyData.currentTierInfo.name}</span>
                        <span>{loyaltyData.nextTier.name}</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-body-sm text-muted-foreground">
                      Earn {loyaltyData.pointsToNextTier} more points to unlock {loyaltyData.nextTier.name} benefits
                    </p>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-h2 mb-2">🎉</div>
                    <p className="text-body font-medium">You&apos;ve reached the highest tier!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <Card variant="default">
            <CardHeader title="Your Benefits" subtitle={`As a ${loyaltyData.currentTierInfo.name} member, you enjoy:`} />
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loyaltyData.currentTierInfo.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="text-success mt-0.5">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-body-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Point Earning Formula */}
          <Card variant="outline">
            <CardHeader title="How to Earn Points" subtitle="Points are calculated based on driving distance:" />
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-h3 font-bold text-primary mb-2">3×</div>
                  <p className="text-body-sm font-medium mb-1">0-20 km</p>
                  <p className="text-caption text-muted-foreground">3 points per km</p>
                </div>
                <div className="text-center p-4 bg-warning-50 rounded-lg">
                  <div className="text-h3 font-bold text-warning mb-2">4×</div>
                  <p className="text-body-sm font-medium mb-1">21-50 km</p>
                  <p className="text-caption text-muted-foreground">60 + 4 points per km above 20</p>
                </div>
                <div className="text-center p-4 bg-success-50 rounded-lg">
                  <div className="text-h3 font-bold text-success mb-2">5×</div>
                  <p className="text-body-sm font-medium mb-1">51+ km</p>
                  <p className="text-caption text-muted-foreground">180 + 5 points per km above 50</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rewards Tab */}
      {selectedTab === 'rewards' && (
        <div className="grid gap-6">
          <Card variant="default">
            <CardHeader title="Available Rewards" subtitle="Redeem your points for these exclusive offers:" />
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loyaltyData.redemptionOptions.map((option) => {
                  const canRedeem = loyaltyData.currentPoints >= option.pointsRequired;
                  
                  return (
                    <Card 
                      key={option.id}
                      variant="outline"
                      className={clsx(
                        'transition-all duration-200',
                        canRedeem 
                          ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer border-primary/20' 
                          : 'opacity-60'
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className={clsx(
                            'p-2 rounded-lg',
                            option.type === 'discount' ? 'bg-success-50 text-success' : 'bg-info-50 text-info'
                          )}>
                            {option.type === 'discount' ? (
                              <DollarSign className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>
                          <Badge 
                            variant={canRedeem ? 'success' : 'neutral'}
                            size="sm"
                          >
                            {option.pointsRequired} pts
                          </Badge>
                        </div>
                        
                        <h4 className="text-h4 mb-2">{option.label}</h4>
                        <p className="text-body-sm text-muted-foreground mb-4">
                          {option.description}
                        </p>
                        
                        <Button
                          variant={canRedeem ? 'primary' : 'outline'}
                          size="sm"
                          fullWidth
                          disabled={!canRedeem}
                          loading={redeeming === option.id}
                          onClick={() => handleRedeem(option.id)}
                        >
                          {redeeming === option.id
                            ? 'Redeeming...'
                            : canRedeem
                              ? 'Redeem Now'
                              : 'Not Enough Points'
                          }
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calculator Tab */}
      {selectedTab === 'calculator' && (
        <PointsCalculator />
      )}

      {/* History Tab */}
      {selectedTab === 'history' && (
        <div className="grid gap-6">
          <Card variant="default">
            <CardHeader title="Points History" subtitle="Track your recent loyalty activity:" />
            <CardContent>
              {loyaltyData.transactions.length > 0 ? (
                <div className="space-y-3">
                  {loyaltyData.transactions.map((transaction) => (
                    <div 
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={clsx(
                          'p-2 rounded-full',
                          transaction.transactionType === 'EARNED' 
                            ? 'bg-success-50 text-success' 
                            : 'bg-warning-50 text-warning'
                        )}>
                          {transaction.transactionType === 'EARNED' ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <Gift className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-body-sm text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={clsx(
                          'font-bold',
                          transaction.transactionType === 'EARNED' ? 'text-success' : 'text-warning'
                        )}>
                          {transaction.transactionType === 'EARNED' ? '+' : '-'}{Math.abs(transaction.points)}
                        </div>
                        <div className="text-body-sm text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-h4 mb-2">No history yet</h3>
                  <p className="text-body text-muted-foreground">
                    Start renting cars to earn your first loyalty points!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LoyaltyDashboard;