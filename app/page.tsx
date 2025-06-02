'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Car, Truck, Zap, Crown, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import CarCard from '@/components/CarCard';

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  costPerDay: number;
  normalizedCategory: string;
  passengerCapacity: number;
  transmission: string;
  fuelType: string;
  images: string[];
  specs: string[];
  availabilityForRent: boolean;
  availabilityForSale: boolean;
  salePrice?: number;
  averageRating?: number;
  totalReviews?: number;
  rentalStatus: string;
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  // Fetch cars data
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars?limit=12');
        const data = await response.json();
        setCars(data.cars || []);
        
        // Set featured cars (first 3 available cars)
        const featured = (data.cars || [])
          .filter((car: Car) => car.availabilityForRent)
          .slice(0, 3);
        setFeaturedCars(featured);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Filter cars based on search and category
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || car.normalizedCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(cars.map(car => car.normalizedCategory))];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto text-center space-y-8 lg:space-y-12">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Premium Car Rental
                <span className="gradient-text block mt-2">Made Simple</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover our fleet of premium vehicles. From economy to luxury,
                find the perfect car for your journey with transparent pricing and excellent service.
              </p>
            </div>

            {/* Quick Search */}
            <Card className="max-w-3xl mx-auto shadow-lg">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search cars, brands, or categories..."
                      leftIcon={Search}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      fullWidth
                      className="h-12 lg:h-14 text-base"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 lg:gap-2">
                    <select
                      className="input h-12 lg:h-14 min-w-[160px] bg-background"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      aria-label="Select vehicle category"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <Link href="/cars" className="w-full sm:w-auto">
                      <Button variant="primary" size="lg" className="w-full sm:w-auto h-12 lg:h-14 px-6 lg:px-8">
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto mt-12">
              <div className="text-center p-4 lg:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">{cars.length}+</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Vehicles Available</div>
              </div>
              <div className="text-center p-4 lg:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Customer Support</div>
              </div>
              <div className="text-center p-4 lg:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Pickup Locations</div>
              </div>
              <div className="text-center p-4 lg:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 lg:py-24">
        <div className="container-responsive">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 lg:mb-6">
              Featured Vehicles
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Hand-picked premium vehicles for an exceptional driving experience
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <Card className="overflow-hidden">
                    <div className="h-48 lg:h-56 bg-muted"></div>
                    <CardContent className="p-4 lg:p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredCars.map(car => (
                <CarCard
                  key={car.id}
                  car={car}
                  variant="featured"
                  onBookNow={(carId) => window.location.href = `/booking/checkout?carId=${carId}`}
                  onViewDetails={(carId) => window.location.href = `/cars/${carId}`}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12 lg:mt-16">
            <Link href="/cars">
              <Button variant="outline" size="lg" className="px-8 py-3">
                View All Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container-responsive">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 lg:mb-6">
              Browse by Category
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto">
              Find the perfect vehicle type for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {categories.map(category => {
              const categoryCount = cars.filter(car => car.normalizedCategory === category).length;
              
              // Get appropriate icon for category
              const getCategoryIcon = (cat: string) => {
                const lowerCat = cat.toLowerCase();
                if (lowerCat.includes('luxury') || lowerCat.includes('premium')) return Crown;
                if (lowerCat.includes('suv') || lowerCat.includes('truck')) return Truck;
                if (lowerCat.includes('electric') || lowerCat.includes('hybrid')) return Zap;
                if (lowerCat.includes('family') || lowerCat.includes('minivan')) return Users;
                return Car;
              };
              
              const IconComponent = getCategoryIcon(category);
              
              return (
                <Link
                  key={category}
                  href={`/cars?category=${category.toLowerCase()}`}
                  className="group"
                >
                  <Card className="text-center p-4 lg:p-6 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <div className="space-y-3 lg:space-y-4">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <IconComponent className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm lg:text-base text-foreground group-hover:text-primary transition-colors">
                          {category}
                        </h3>
                        <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                          {categoryCount} available
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Available Now */}
      <section className="py-16 lg:py-24">
        <div className="container-responsive">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 lg:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {searchTerm || selectedCategory ? 'Search Results' : 'Available Now'}
              </h2>
              <p className="text-base lg:text-lg text-muted-foreground">
                {filteredCars.length} vehicles found
              </p>
            </div>
            <Link href="/cars">
              <Button variant="outline" size="lg" className="whitespace-nowrap">
                View All
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse">
                  <Card className="overflow-hidden">
                    <div className="h-40 lg:h-48 bg-muted"></div>
                    <CardContent className="p-4 lg:p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {filteredCars.slice(0, 8).map(car => (
                <CarCard
                  key={car.id}
                  car={car}
                  variant="compact"
                  onBookNow={(carId) => window.location.href = `/booking/checkout?carId=${carId}`}
                  onViewDetails={(carId) => window.location.href = `/cars/${carId}`}
                />
              ))}
            </div>
          )}

          {filteredCars.length === 0 && !loading && (
            <div className="text-center py-16 lg:py-24">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 lg:w-12 lg:h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3">No cars found</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or browse all available vehicles.
              </p>
              <Link href="/cars">
                <Button variant="primary" size="lg">Browse All Cars</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 opacity-90"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="container-responsive text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8 lg:space-y-10">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
              Ready to Hit the Road?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who trust us for their car rental needs.
              Premium vehicles, competitive prices, and exceptional service guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center pt-4">
              <Link href="/cars">
                <Button variant="primary" size="lg" className="w-full shadow-2xl sm:w-auto px-8 py-4 text-lg font-semibold">
                  Browse Cars
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary transition-all duration-300"
                >
                  Join Our Loyalty Program
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
