'use client';

import React, { useState, useEffect } from 'react';
import {
  Car, Plus, Search, MapPin, Calendar, Settings,
  Battery, Fuel, AlertTriangle, CheckCircle, Clock, Wrench,
  Navigation, Shield, Star, TrendingUp, Eye
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  licensePlate: string;
  status: 'available' | 'rented' | 'maintenance' | 'reserved';
  location: string;
  mileage: number;
  fuelLevel: number;
  batteryLevel: number;
  lastService: string;
  nextService: string;
  totalBookings: number;
  averageRating: number;
  monthlyRevenue: number;
  utilizationRate: number;
  features: string[];
  issues: string[];
  images: string[];
  gpsCoordinates: { lat: number; lng: number };
  costPerDay: number;
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
    status: 'active' | 'expiring' | 'expired';
  };
  maintenance: {
    lastCheck: string;
    nextCheck: string;
    odometer: number;
    items: string[];
  };
}

export default function FleetManagementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Simulate API call with enhanced mock data
        const mockVehicles: Vehicle[] = [
          {
            id: '1',
            name: 'Toyota Camry 2024',
            brand: 'Toyota',
            model: 'Camry',
            year: 2024,
            category: 'Sedan',
            licensePlate: '30A-12345',
            status: 'available',
            location: 'District 1, Ho Chi Minh City',
            mileage: 15420,
            fuelLevel: 85,
            batteryLevel: 95,
            lastService: '2024-05-15',
            nextService: '2024-08-15',
            totalBookings: 45,
            averageRating: 4.7,
            monthlyRevenue: 8750,
            utilizationRate: 87.5,
            features: ['GPS Navigation', 'Bluetooth', 'Backup Camera', 'Climate Control'],
            issues: [],
            images: ['/placeholder-car.jpg'],
            gpsCoordinates: { lat: 10.7769, lng: 106.7009 },
            costPerDay: 75,
            insurance: {
              provider: 'VietinBank Insurance',
              policyNumber: 'VTB-2024-001',
              expiryDate: '2024-12-31',
              status: 'active'
            },
            maintenance: {
              lastCheck: '2024-05-15',
              nextCheck: '2024-08-15',
              odometer: 15420,
              items: ['Oil Change', 'Tire Rotation', 'Brake Inspection']
            }
          },
          {
            id: '2',
            name: 'Honda CR-V 2023',
            brand: 'Honda',
            model: 'CR-V',
            year: 2023,
            category: 'SUV',
            licensePlate: '30B-67890',
            status: 'rented',
            location: 'District 7, Ho Chi Minh City',
            mileage: 23890,
            fuelLevel: 45,
            batteryLevel: 88,
            lastService: '2024-04-20',
            nextService: '2024-07-20',
            totalBookings: 67,
            averageRating: 4.6,
            monthlyRevenue: 12400,
            utilizationRate: 82.3,
            features: ['AWD', 'Honda Sensing', 'Sunroof', 'Heated Seats'],
            issues: ['Low tire pressure warning'],
            images: ['/placeholder-car.jpg'],
            gpsCoordinates: { lat: 10.7324, lng: 106.7224 },
            costPerDay: 95,
            insurance: {
              provider: 'Bao Viet Insurance',
              policyNumber: 'BV-2023-002',
              expiryDate: '2024-11-30',
              status: 'active'
            },
            maintenance: {
              lastCheck: '2024-04-20',
              nextCheck: '2024-07-20',
              odometer: 23890,
              items: ['Oil Change', 'Air Filter', 'Brake Pads']
            }
          },
          {
            id: '3',
            name: 'BMW X5 2023',
            brand: 'BMW',
            model: 'X5',
            year: 2023,
            category: 'Luxury',
            licensePlate: '30C-11111',
            status: 'maintenance',
            location: 'Service Center - District 2',
            mileage: 18750,
            fuelLevel: 30,
            batteryLevel: 92,
            lastService: '2024-05-01',
            nextService: '2024-08-01',
            totalBookings: 32,
            averageRating: 4.9,
            monthlyRevenue: 16800,
            utilizationRate: 65.4,
            features: ['Luxury Package', 'Premium Sound', 'Panoramic Roof', 'Adaptive Cruise'],
            issues: ['Scheduled maintenance in progress'],
            images: ['/placeholder-car.jpg'],
            gpsCoordinates: { lat: 10.7829, lng: 106.7512 },
            costPerDay: 180,
            insurance: {
              provider: 'AIA Insurance',
              policyNumber: 'AIA-2023-003',
              expiryDate: '2025-01-15',
              status: 'active'
            },
            maintenance: {
              lastCheck: '2024-05-01',
              nextCheck: '2024-08-01',
              odometer: 18750,
              items: ['Major Service', 'Transmission Check', 'Software Update']
            }
          }
        ];
        setVehicles(mockVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-success bg-success/10 border-success/20';
      case 'rented': return 'text-warning bg-warning/10 border-warning/20';
      case 'maintenance': return 'text-error bg-error/10 border-error/20';
      case 'reserved': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-muted border-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'rented': return <Clock className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'reserved': return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getInsuranceStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'expiring': return 'text-warning';
      case 'expired': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || vehicle.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'revenue': return b.monthlyRevenue - a.monthlyRevenue;
      case 'utilization': return b.utilizationRate - a.utilizationRate;
      case 'mileage': return a.mileage - b.mileage;
      default: return 0;
    }
  });

  const categories = [...new Set(vehicles.map(v => v.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-muted rounded"></div>
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
            <h1 className="text-3xl font-bold text-foreground">Fleet Management</h1>
            <p className="text-muted-foreground">
              Manage your vehicle fleet with AI-powered insights and real-time monitoring
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Bulk Actions
            </Button>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search vehicles, license plates..."
              leftIcon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            title="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
            <option value="reserved">Reserved</option>
          </select>
          <select
            className="input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            title="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Sort by"
          >
            <option value="name">Sort by Name</option>
            <option value="revenue">Sort by Revenue</option>
            <option value="utilization">Sort by Utilization</option>
            <option value="mileage">Sort by Mileage</option>
          </select>
        </div>

        {/* Fleet Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Fleet</p>
                  <p className="text-3xl font-bold text-foreground">{vehicles.length}</p>
                </div>
                <Car className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available</p>
                  <p className="text-3xl font-bold text-success">
                    {vehicles.filter(v => v.status === 'available').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Use</p>
                  <p className="text-3xl font-bold text-warning">
                    {vehicles.filter(v => v.status === 'rented').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                  <p className="text-3xl font-bold text-error">
                    {vehicles.filter(v => v.status === 'maintenance').length}
                  </p>
                </div>
                <Wrench className="w-8 h-8 text-error" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVehicles.map(vehicle => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-card-hover transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{vehicle.name}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
                    {getStatusIcon(vehicle.status)}
                    {vehicle.status}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{vehicle.location}</span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-semibold text-foreground">${vehicle.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Utilization</p>
                    <p className="font-semibold text-foreground">{vehicle.utilizationRate}%</p>
                  </div>
                </div>

                {/* Vehicle Health */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Fuel className="w-4 h-4 text-muted-foreground" />
                      Fuel
                    </span>
                    <span className={`font-medium ${vehicle.fuelLevel > 50 ? 'text-success' : vehicle.fuelLevel > 25 ? 'text-warning' : 'text-error'}`}>
                      {vehicle.fuelLevel}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        vehicle.fuelLevel > 50 ? 'bg-success' : vehicle.fuelLevel > 25 ? 'bg-warning' : 'bg-error'
                      }`}
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    />
                  </div>
                </div>

                {/* Battery Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Battery className="w-4 h-4 text-muted-foreground" />
                      Battery
                    </span>
                    <span className="font-medium text-success">{vehicle.batteryLevel}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="bg-success h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${vehicle.batteryLevel}%` }}
                    />
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{vehicle.averageRating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span>{vehicle.totalBookings} bookings</span>
                  </div>
                </div>

                {/* Issues Alert */}
                {vehicle.issues.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-warning/10 border border-warning/20 rounded">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span className="text-sm text-warning">{vehicle.issues[0]}</span>
                  </div>
                )}

                {/* Insurance Status */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    Insurance
                  </span>
                  <span className={`font-medium ${getInsuranceStatusColor(vehicle.insurance.status)}`}>
                    {vehicle.insurance.status}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  fullWidth
                  onClick={() => {}}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <Navigation className="w-4 h-4 mr-1" />
                  Track
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedVehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No vehicles found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or add a new vehicle to your fleet.
            </p>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}