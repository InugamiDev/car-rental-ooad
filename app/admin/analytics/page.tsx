'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp, DollarSign, Car, Users, Calendar, MapPin,
  BarChart3, Download, RefreshCw
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface AnalyticsData {
  revenue: {
    daily: { date: string; amount: number; bookings: number }[];
    monthly: { month: string; amount: number; growth: number }[];
    yearly: { year: number; amount: number; growth: number }[];
  };
  bookings: {
    statusBreakdown: { status: string; count: number; percentage: number }[];
    categoryBreakdown: { category: string; count: number; revenue: number }[];
    locationBreakdown: { location: string; count: number; revenue: number }[];
  };
  vehicles: {
    utilization: { vehicleId: string; name: string; utilizationRate: number; revenue: number }[];
    performance: { category: string; averageRating: number; bookingCount: number; revenue: number }[];
  };
  customers: {
    demographics: { ageGroup: string; count: number; percentage: number }[];
    loyalty: { tier: string; count: number; averageSpend: number }[];
    retention: { month: string; newCustomers: number; returningCustomers: number }[];
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Simulate API call with mock data
        const mockData: AnalyticsData = {
          revenue: {
            daily: generateDailyRevenue(),
            monthly: [
              { month: 'Jan', amount: 45200, growth: 12.5 },
              { month: 'Feb', amount: 52100, growth: 15.3 },
              { month: 'Mar', amount: 48900, growth: 8.2 },
              { month: 'Apr', amount: 61500, growth: 25.8 },
              { month: 'May', amount: 58700, growth: -4.5 },
              { month: 'Jun', amount: 67200, growth: 14.5 }
            ],
            yearly: [
              { year: 2022, amount: 485000, growth: 0 },
              { year: 2023, amount: 652000, growth: 34.4 },
              { year: 2024, amount: 847000, growth: 29.9 }
            ]
          },
          bookings: {
            statusBreakdown: [
              { status: 'Completed', count: 1245, percentage: 68.5 },
              { status: 'Active', count: 328, percentage: 18.1 },
              { status: 'Confirmed', count: 156, percentage: 8.6 },
              { status: 'Cancelled', count: 89, percentage: 4.8 }
            ],
            categoryBreakdown: [
              { category: 'Sedan', count: 456, revenue: 34200 },
              { category: 'SUV', count: 342, revenue: 51300 },
              { category: 'Hatchback', count: 289, revenue: 17340 },
              { category: 'Luxury', count: 67, revenue: 26800 },
              { category: 'Van', count: 123, revenue: 14760 }
            ],
            locationBreakdown: [
              { location: 'District 1', count: 234, revenue: 28080 },
              { location: 'District 3', count: 189, revenue: 22680 },
              { location: 'District 7', count: 167, revenue: 20040 },
              { location: 'Airport', count: 145, revenue: 21750 },
              { location: 'Tan Binh', count: 112, revenue: 13440 }
            ]
          },
          vehicles: {
            utilization: [
              { vehicleId: '1', name: 'Toyota Camry 2024', utilizationRate: 87.5, revenue: 8750 },
              { vehicleId: '2', name: 'Honda CR-V 2023', utilizationRate: 82.3, revenue: 7896 },
              { vehicleId: '3', name: 'Ford Ranger 2024', utilizationRate: 79.1, revenue: 9487 },
              { vehicleId: '4', name: 'BMW X5 2023', utilizationRate: 65.4, revenue: 13080 },
              { vehicleId: '5', name: 'Mercedes C-Class', utilizationRate: 71.2, revenue: 14240 }
            ],
            performance: [
              { category: 'Luxury', averageRating: 4.8, bookingCount: 67, revenue: 26800 },
              { category: 'SUV', averageRating: 4.6, bookingCount: 342, revenue: 51300 },
              { category: 'Sedan', averageRating: 4.5, bookingCount: 456, revenue: 34200 },
              { category: 'Van', averageRating: 4.3, bookingCount: 123, revenue: 14760 },
              { category: 'Hatchback', averageRating: 4.2, bookingCount: 289, revenue: 17340 }
            ]
          },
          customers: {
            demographics: [
              { ageGroup: '18-25', count: 234, percentage: 18.9 },
              { ageGroup: '26-35', count: 456, percentage: 36.8 },
              { ageGroup: '36-45', count: 342, percentage: 27.6 },
              { ageGroup: '46-55', count: 156, percentage: 12.6 },
              { ageGroup: '55+', count: 52, percentage: 4.1 }
            ],
            loyalty: [
              { tier: 'Bronze', count: 890, averageSpend: 120 },
              { tier: 'Silver', count: 256, averageSpend: 185 },
              { tier: 'Gold', count: 78, averageSpend: 310 },
              { tier: 'Platinum', count: 16, averageSpend: 580 }
            ],
            retention: [
              { month: 'Jan', newCustomers: 89, returningCustomers: 145 },
              { month: 'Feb', newCustomers: 102, returningCustomers: 167 },
              { month: 'Mar', newCustomers: 78, returningCustomers: 189 },
              { month: 'Apr', newCustomers: 134, returningCustomers: 203 },
              { month: 'May', newCustomers: 91, returningCustomers: 221 },
              { month: 'Jun', newCustomers: 116, returningCustomers: 234 }
            ]
          }
        };
        
        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [selectedTimeRange]);

  const generateDailyRevenue = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 3000) + 1000,
        bookings: Math.floor(Math.random() * 15) + 5
      });
    }
    return days;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-success' : 'text-error';
  };

  const exportData = () => {
    // Simulate data export
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${selectedTimeRange}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
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
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive business intelligence and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              className="input"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
              title="Select time range"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(analyticsData?.revenue.monthly.reduce((sum, month) => sum + month.amount, 0) || 0)}
                  </p>
                  <p className="text-sm text-success">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +14.5% this month
                  </p>
                </div>
                <div className="p-3 bg-success/10 rounded-full">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-bold text-foreground">
                    {analyticsData?.bookings.statusBreakdown.reduce((sum, status) => sum + status.count, 0)}
                  </p>
                  <p className="text-sm text-success">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +8.2% this month
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fleet Utilization</p>
                  <p className="text-3xl font-bold text-foreground">77.1%</p>
                  <p className="text-sm text-success">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +3.2% this month
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-full">
                  <Car className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                  <p className="text-3xl font-bold text-foreground">
                    {analyticsData?.customers.demographics.reduce((sum, demo) => sum + demo.count, 0)}
                  </p>
                  <p className="text-sm text-success">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +116 new this month
                  </p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-full">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Monthly Revenue Trend</h3>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Last 6 months</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.revenue.monthly.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-sm font-medium">{month.month}</div>
                      <div className="flex-1 bg-muted rounded-full h-2 relative">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-500"
                          style={{ width: `${(month.amount / 70000) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(month.amount)}</div>
                      <div className={`text-sm ${getGrowthColor(month.growth)}`}>
                        {month.growth > 0 ? '+' : ''}{month.growth.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Booking Status Distribution</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.bookings.statusBreakdown.map((status) => (
                  <div key={status.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-16 text-sm font-medium">{status.status}</div>
                      <div className="flex-1 bg-muted rounded-full h-2 relative">
                        <div 
                          className="bg-success rounded-full h-2 transition-all duration-500"
                          style={{ width: `${status.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{status.count}</div>
                      <div className="text-sm text-muted-foreground">{status.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Top Performing Vehicles</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.vehicles.utilization.slice(0, 5).map((vehicle, index) => (
                  <div key={vehicle.vehicleId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{vehicle.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.utilizationRate}% utilization
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatCurrency(vehicle.revenue)}</p>
                      <p className="text-sm text-success">This month</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Category Performance</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.vehicles.performance.map((category) => (
                  <div key={category.category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{category.category}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>★ {category.averageRating}</span>
                        <span>{category.bookingCount} bookings</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatCurrency(category.revenue)}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Customer Demographics</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData?.customers.demographics.map((demo) => (
                  <div key={demo.ageGroup} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{demo.ageGroup}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-secondary rounded-full h-2"
                          style={{ width: `${demo.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{demo.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Loyalty Program</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData?.customers.loyalty.map((tier) => (
                  <div key={tier.tier} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{tier.tier}</p>
                      <p className="text-sm text-muted-foreground">{tier.count} members</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatCurrency(tier.averageSpend)}</p>
                      <p className="text-sm text-muted-foreground">Avg. spend</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Location Performance</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData?.bookings.locationBreakdown.map((location) => (
                  <div key={location.location} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{location.location}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatCurrency(location.revenue)}</p>
                      <p className="text-sm text-muted-foreground">{location.count} bookings</p>
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