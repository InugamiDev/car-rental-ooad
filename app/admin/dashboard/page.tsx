'use client';

import React, { useState, useEffect } from 'react';
import { 
  Car, Users, Calendar, DollarSign, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle, Clock, MapPin, Settings, Plus,
  BarChart3, PieChart, Activity, Eye
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';

interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  activeBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalUsers: number;
  newUsersThisMonth: number;
}

interface RecentBooking {
  id: string;
  customerName: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}

interface VehicleStatus {
  id: string;
  name: string;
  status: 'available' | 'rented' | 'maintenance' | 'reserved';
  location: string;
  nextBooking?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [vehicleStatuses, setVehicleStatuses] = useState<VehicleStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API calls - replace with actual API endpoints
        await Promise.all([
          fetchStats(),
          fetchRecentBookings(),
          fetchVehicleStatuses()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedTimeRange]);

  const fetchStats = async () => {
    // Simulate API call
    const mockStats: DashboardStats = {
      totalVehicles: 52,
      availableVehicles: 31,
      activeBookings: 18,
      totalRevenue: 125000,
      monthlyRevenue: 28500,
      averageRating: 4.7,
      totalUsers: 1240,
      newUsersThisMonth: 89
    };
    setStats(mockStats);
  };

  const fetchRecentBookings = async () => {
    // Simulate API call
    const mockBookings: RecentBooking[] = [
      {
        id: '1',
        customerName: 'Nguyen Van A',
        carName: 'Toyota Camry 2024',
        startDate: '2024-06-01',
        endDate: '2024-06-05',
        totalAmount: 300,
        status: 'confirmed'
      },
      {
        id: '2',
        customerName: 'Tran Thi B',
        carName: 'Honda CR-V 2023',
        startDate: '2024-06-02',
        endDate: '2024-06-04',
        totalAmount: 180,
        status: 'in_progress'
      },
      {
        id: '3',
        customerName: 'Le Van C',
        carName: 'Ford Ranger 2024',
        startDate: '2024-05-28',
        endDate: '2024-06-01',
        totalAmount: 250,
        status: 'completed'
      }
    ];
    setRecentBookings(mockBookings);
  };

  const fetchVehicleStatuses = async () => {
    // Simulate API call
    const mockStatuses: VehicleStatus[] = [
      {
        id: '1',
        name: 'Toyota Camry 2024',
        status: 'rented',
        location: 'District 1, Ho Chi Minh City',
        nextBooking: '2024-06-05'
      },
      {
        id: '2',
        name: 'Honda CR-V 2023',
        status: 'available',
        location: 'District 3, Ho Chi Minh City'
      },
      {
        id: '3',
        name: 'Ford Ranger 2024',
        status: 'maintenance',
        location: 'Service Center - District 7'
      }
    ];
    setVehicleStatuses(mockStatuses);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-success bg-success/10';
      case 'rented': case 'in_progress': return 'text-warning bg-warning/10';
      case 'maintenance': return 'text-error bg-error/10';
      case 'confirmed': return 'text-primary bg-primary/10';
      case 'completed': return 'text-success bg-success/10';
      case 'cancelled': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'rented': case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-muted rounded"></div>
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
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your car rental business.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              className="input"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as '7d' | '30d' | '90d')}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalVehicles}</p>
                  <p className="text-sm text-success">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +3 this month
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Car className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.activeBookings}</p>
                  <p className="text-sm text-success">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-full">
                  <Calendar className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-foreground">${stats?.monthlyRevenue?.toLocaleString()}</p>
                  <p className="text-sm text-success">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +8.2% from last month
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
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalUsers}</p>
                  <p className="text-sm text-success">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +{stats?.newUsersThisMonth} new this month
                  </p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-full">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Bookings</h3>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Car className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">{booking.carName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.startDate} to {booking.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${booking.totalAmount}</p>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Status */}
          <div>
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Vehicle Status</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-success/10 rounded-lg">
                      <p className="text-2xl font-bold text-success">{stats?.availableVehicles}</p>
                      <p className="text-sm text-success">Available</p>
                    </div>
                    <div className="text-center p-3 bg-warning/10 rounded-lg">
                      <p className="text-2xl font-bold text-warning">{stats?.activeBookings}</p>
                      <p className="text-sm text-warning">In Use</p>
                    </div>
                  </div>

                  {/* Individual Vehicle Status */}
                  <div className="space-y-3">
                    {vehicleStatuses.map(vehicle => (
                      <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-foreground text-sm">{vehicle.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {vehicle.location}
                          </p>
                          {vehicle.nextBooking && (
                            <p className="text-xs text-muted-foreground">
                              Next: {vehicle.nextBooking}
                            </p>
                          )}
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                          {getStatusIcon(vehicle.status)}
                          {vehicle.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" fullWidth>
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Fleet
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Add Vehicle</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm">View Reports</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Manage Users</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <Settings className="w-5 h-5" />
                  <span className="text-sm">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}