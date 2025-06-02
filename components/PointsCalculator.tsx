'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import Input from './ui/Input';
import Badge from './ui/Badge';
import { Calculator, TrendingUp, Award } from 'lucide-react';
import { calculateLoyaltyPoints, getEstimatedEarnings } from '@/lib/loyalty';
import { clsx } from 'clsx';

const PointsCalculator: React.FC = () => {
  const [kilometers, setKilometers] = useState<string>('');
  const [userPoints, setUserPoints] = useState<string>('1000');
  const [calculation, setCalculation] = useState<ReturnType<typeof getEstimatedEarnings> | null>(null);

  useEffect(() => {
    const km = parseFloat(kilometers);
    const points = parseFloat(userPoints) || 0;
    
    if (km && km > 0) {
      const result = getEstimatedEarnings(km, points);
      setCalculation(result);
    } else {
      setCalculation(null);
    }
  }, [kilometers, userPoints]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'warning';
      case 'silver': return 'neutral';
      case 'gold': return 'warning';
      case 'platinum': return 'info';
      default: return 'default';
    }
  };

  const examples = [
    { km: 15, description: '15km city drive' },
    { km: 35, description: '35km suburban trip' },
    { km: 75, description: '75km highway journey' },
    { km: 150, description: '150km long distance' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Calculator */}
      <Card variant="elevated">
        <CardHeader title="Points Calculator" subtitle="See how many points you'll earn based on driving distance">
          <Calculator className="w-6 h-6 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <Input
                label="Distance Driven (km)"
                type="number"
                placeholder="Enter kilometers"
                value={kilometers}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKilometers(e.target.value)}
                min="0"
                step="0.1"
              />
              
              <Input
                label="Your Current Points (for tier calculation)"
                type="number"
                placeholder="Enter your current points"
                value={userPoints}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserPoints(e.target.value)}
                min="0"
                step="1"
                helperText="This affects your tier multiplier"
              />
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {calculation ? (
                <>
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-medium">Base Points</span>
                      <span className="text-lg font-bold text-primary">
                        {calculation.basePoints.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-body-sm text-muted-foreground">
                      {calculation.breakdown.formula}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg border border-success-200">
                    <div>
                      <span className="text-body font-medium text-success-700">Final Points</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getTierColor(calculation.tier.name.toLowerCase())} size="sm">
                          {calculation.tier.name} × {calculation.tier.multiplier}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-h3 font-bold text-success-700">
                      {calculation.multipliedPoints.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-body-sm">
                        Distance Category: <strong>{calculation.breakdown.tier}</strong>
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Enter a distance to see your points calculation</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formula Explanation */}
      <Card variant="outline">
        <CardHeader title="Points Formula" subtitle="Our tiered reward system explained" />
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="text-h3 font-bold text-primary mb-2">3×</div>
              <p className="text-body-sm font-medium mb-1">0-20 km</p>
              <p className="text-caption text-muted-foreground">3 points per kilometer</p>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg border border-warning-200">
              <div className="text-h3 font-bold text-warning mb-2">4×</div>
              <p className="text-body-sm font-medium mb-1">21-50 km</p>
              <p className="text-caption text-muted-foreground">60 + 4 points per km above 20</p>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg border border-success-200">
              <div className="text-h3 font-bold text-success mb-2">5×</div>
              <p className="text-body-sm font-medium mb-1">51+ km</p>
              <p className="text-caption text-muted-foreground">180 + 5 points per km above 50</p>
            </div>
          </div>

          <div className="text-center text-body-sm text-muted-foreground">
            <Award className="w-4 h-4 inline mr-1" />
            Points are then multiplied by your membership tier bonus
          </div>
        </CardContent>
      </Card>

      {/* Quick Examples */}
      <Card variant="default">
        <CardHeader title="Quick Examples" subtitle="See how the formula works in practice" />
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {examples.map((example, index) => {
              const calc = calculateLoyaltyPoints(example.km);
              return (
                <div 
                  key={index}
                  className={clsx(
                    'p-4 rounded-lg border cursor-pointer transition-colors',
                    'hover:bg-muted/50 hover:border-primary/50',
                    kilometers === example.km.toString() && 'bg-primary-50 border-primary'
                  )}
                  onClick={() => setKilometers(example.km.toString())}
                >
                  <div className="text-center">
                    <div className="text-h4 font-bold text-primary mb-1">
                      {calc.points}
                    </div>
                    <p className="text-body-sm font-medium mb-1">{example.km}km</p>
                    <p className="text-caption text-muted-foreground">
                      {example.description}
                    </p>
                    <Badge 
                      variant={getTierColor(calc.tier)} 
                      size="sm" 
                      className="mt-2"
                    >
                      {calc.tier}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PointsCalculator;