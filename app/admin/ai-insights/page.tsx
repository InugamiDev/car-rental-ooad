'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain, TrendingUp, Target, Zap, AlertCircle,
  DollarSign, Users, Car, Clock, Lightbulb,
  BarChart3, ArrowRight, RefreshCw, Download
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface AIInsight {
  id: string;
  type: 'pricing' | 'demand' | 'maintenance' | 'customer' | 'inventory';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  potentialValue: number;
  actionable: boolean;
  recommendation: string;
  data: Record<string, unknown>;
}

interface PricingRecommendation {
  vehicleId: string;
  vehicleName: string;
  currentPrice: number;
  recommendedPrice: number;
  priceChange: number;
  reason: string;
  expectedImpact: string;
  demand: number;
  competition: number;
}

interface DemandForecast {
  date: string;
  category: string;
  predictedDemand: number;
  confidence: number;
  factors: string[];
}

interface MaintenancePrediction {
  vehicleId: string;
  vehicleName: string;
  predictedIssues: string[];
  probability: number;
  estimatedCost: number;
  recommendedAction: string;
  urgency: 'low' | 'medium' | 'high';
}

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [pricingRecommendations, setPricingRecommendations] = useState<PricingRecommendation[]>([]);
  const [demandForecasts, setDemandForecasts] = useState<DemandForecast[]>([]);
  const [maintenancePredictions, setMaintenancePredictions] = useState<MaintenancePrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsightType, setSelectedInsightType] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      // Simulate AI analysis with mock data
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'pricing',
          title: 'Optimize Pricing for Weekend Demand',
          description: 'AI detected 35% higher demand for luxury vehicles on weekends. Recommend 15-20% price increase.',
          impact: 'high',
          confidence: 89,
          potentialValue: 12500,
          actionable: true,
          recommendation: 'Increase luxury vehicle prices by 18% for Friday-Sunday bookings',
          data: { category: 'Luxury', timeframe: 'weekends', demandIncrease: 35 }
        },
        {
          id: '2',
          type: 'demand',
          title: 'Seasonal Demand Spike Predicted',
          description: 'ML models predict 45% increase in SUV demand next month due to holiday season.',
          impact: 'high',
          confidence: 92,
          potentialValue: 18700,
          actionable: true,
          recommendation: 'Increase SUV inventory and consider dynamic pricing strategy',
          data: { category: 'SUV', predictedIncrease: 45, timeframe: 'next month' }
        },
        {
          id: '3',
          type: 'maintenance',
          title: 'Predictive Maintenance Alert',
          description: 'BMW X5 (30C-11111) shows patterns indicating potential transmission issues within 2 weeks.',
          impact: 'medium',
          confidence: 76,
          potentialValue: 3200,
          actionable: true,
          recommendation: 'Schedule immediate transmission inspection to prevent breakdown',
          data: { vehicleId: '3', issue: 'transmission', probability: 76 }
        },
        {
          id: '4',
          type: 'customer',
          title: 'Customer Churn Risk Identified',
          description: '23 premium customers show behavioral patterns indicating high churn risk.',
          impact: 'high',
          confidence: 84,
          potentialValue: 28900,
          actionable: true,
          recommendation: 'Launch targeted retention campaign with personalized offers',
          data: { customersAtRisk: 23, avgValue: 1256 }
        },
        {
          id: '5',
          type: 'inventory',
          title: 'Underperforming Vehicle Category',
          description: 'Hatchback category shows declining bookings (-12%) and requires strategic adjustment.',
          impact: 'medium',
          confidence: 71,
          potentialValue: 8400,
          actionable: true,
          recommendation: 'Consider repositioning or replacing underperforming hatchback models',
          data: { category: 'Hatchback', decline: -12, utilization: 34 }
        }
      ];

      const mockPricingRecommendations: PricingRecommendation[] = [
        {
          vehicleId: '1',
          vehicleName: 'Toyota Camry 2024',
          currentPrice: 75,
          recommendedPrice: 82,
          priceChange: 9.3,
          reason: 'High demand, low competition in sedan category',
          expectedImpact: '+15% revenue, -3% bookings',
          demand: 87,
          competition: 23
        },
        {
          vehicleId: '2',
          vehicleName: 'Honda CR-V 2023',
          currentPrice: 95,
          recommendedPrice: 88,
          priceChange: -7.4,
          reason: 'Increasing local competition, maintain market share',
          expectedImpact: '+8% bookings, -2% revenue',
          demand: 76,
          competition: 67
        },
        {
          vehicleId: '3',
          vehicleName: 'BMW X5 2023',
          currentPrice: 180,
          recommendedPrice: 195,
          priceChange: 8.3,
          reason: 'Premium positioning, unique features in market',
          expectedImpact: '+12% revenue, stable bookings',
          demand: 92,
          competition: 12
        }
      ];

      const mockDemandForecasts: DemandForecast[] = [
        {
          date: '2024-07-01',
          category: 'SUV',
          predictedDemand: 145,
          confidence: 89,
          factors: ['Holiday season', 'Weather patterns', 'Tourist influx']
        },
        {
          date: '2024-07-01',
          category: 'Luxury',
          predictedDemand: 67,
          confidence: 84,
          factors: ['Business travel', 'Wedding season', 'Corporate events']
        },
        {
          date: '2024-07-01',
          category: 'Sedan',
          predictedDemand: 234,
          confidence: 92,
          factors: ['Daily commute', 'Airport transfers', 'City tourism']
        }
      ];

      const mockMaintenancePredictions: MaintenancePrediction[] = [
        {
          vehicleId: '2',
          vehicleName: 'Honda CR-V 2023',
          predictedIssues: ['Brake pad wear', 'Tire replacement needed'],
          probability: 78,
          estimatedCost: 850,
          recommendedAction: 'Schedule maintenance within 2 weeks',
          urgency: 'medium'
        },
        {
          vehicleId: '3',
          vehicleName: 'BMW X5 2023',
          predictedIssues: ['Transmission service', 'Engine diagnostic'],
          probability: 65,
          estimatedCost: 1200,
          recommendedAction: 'Monitor closely, schedule inspection',
          urgency: 'low'
        }
      ];

      setInsights(mockInsights);
      setPricingRecommendations(mockPricingRecommendations);
      setDemandForecasts(mockDemandForecasts);
      setMaintenancePredictions(mockMaintenancePredictions);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing
    await fetchAIInsights();
    setRefreshing(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted border-muted';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pricing': return <DollarSign className="w-5 h-5" />;
      case 'demand': return <TrendingUp className="w-5 h-5" />;
      case 'maintenance': return <AlertCircle className="w-5 h-5" />;
      case 'customer': return <Users className="w-5 h-5" />;
      case 'inventory': return <Car className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const filteredInsights = selectedInsightType === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === selectedInsightType);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              AI Business Insights
            </h1>
            <p className="text-muted-foreground">
              Machine learning powered recommendations to optimize your car rental business
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={refreshInsights} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Analyzing...' : 'Refresh AI'}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* AI Processing Status */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Analysis Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Last updated: 2 minutes ago • Next analysis: 4 hours
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-success">Analysis Complete</p>
                <p className="text-xs text-muted-foreground">98.7% confidence score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Potential Revenue</p>
                  <p className="text-3xl font-bold text-success">
                    ${insights.reduce((sum, insight) => sum + insight.potentialValue, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-success">+24.5% optimization</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Insights</p>
                  <p className="text-3xl font-bold text-primary">{insights.length}</p>
                  <p className="text-sm text-primary">{insights.filter(i => i.actionable).length} actionable</p>
                </div>
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round(insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length)}%
                  </p>
                  <p className="text-sm text-success">High accuracy</p>
                </div>
                <Target className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                  <p className="text-3xl font-bold text-foreground">47h</p>
                  <p className="text-sm text-success">This month</p>
                </div>
                <Clock className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insight Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'pricing', 'demand', 'maintenance', 'customer', 'inventory'].map(type => (
            <Button
              key={type}
              variant={selectedInsightType === type ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedInsightType(type)}
            >
              {getInsightIcon(type)}
              <span className="ml-2 capitalize">{type === 'all' ? 'All Insights' : type}</span>
            </Button>
          ))}
        </div>

        {/* AI Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredInsights.map(insight => (
            <Card key={insight.id} className="hover:shadow-card-hover transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Potential Value</p>
                    <p className="font-bold text-success">${insight.potentialValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="font-bold text-foreground">{insight.confidence}%</p>
                  </div>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Recommendation</p>
                      <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>

                {insight.actionable && (
                  <Button variant="primary" size="sm" fullWidth>
                    Implement Recommendation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-success" />
              Dynamic Pricing Recommendations
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pricingRecommendations.map(rec => (
                <div key={rec.vehicleId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{rec.vehicleName}</h4>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rec.expectedImpact}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="font-bold text-foreground">${rec.currentPrice}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground mx-4" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Recommended</p>
                    <p className="font-bold text-primary">${rec.recommendedPrice}</p>
                  </div>
                  <div className="text-center ml-4">
                    <p className={`text-sm font-medium ${rec.priceChange > 0 ? 'text-success' : 'text-error'}`}>
                      {rec.priceChange > 0 ? '+' : ''}{rec.priceChange.toFixed(1)}%
                    </p>
                    <Button variant="outline" size="sm" className="mt-1">
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demand Forecasting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Demand Forecasting
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demandForecasts.map((forecast, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{forecast.category}</h4>
                      <span className="text-sm text-muted-foreground">{forecast.confidence}% confidence</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-2xl font-bold text-primary">{forecast.predictedDemand}</p>
                        <p className="text-sm text-muted-foreground">Predicted bookings</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Key factors:</p>
                        <div className="flex flex-wrap gap-1">
                          {forecast.factors.map((factor, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Predictive Maintenance
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenancePredictions.map(pred => (
                  <div key={pred.vehicleId} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{pred.vehicleName}</h4>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        pred.urgency === 'high' ? 'text-error bg-error/10' :
                        pred.urgency === 'medium' ? 'text-warning bg-warning/10' :
                        'text-success bg-success/10'
                      }`}>
                        {pred.urgency} urgency
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Predicted issues:</p>
                        <p className="text-sm text-foreground">{pred.predictedIssues.join(', ')}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Probability</p>
                          <p className="font-medium text-foreground">{pred.probability}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Est. Cost</p>
                          <p className="font-medium text-foreground">${pred.estimatedCost}</p>
                        </div>
                      </div>
                      <p className="text-sm text-primary">{pred.recommendedAction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}