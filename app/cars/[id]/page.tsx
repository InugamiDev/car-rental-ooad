'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, Users, Fuel, Settings, MapPin, Calendar, 
  Clock, Shield, Award, ArrowLeft, Share2, Heart
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  costPerDay: number;
  costIfExtend: number;
  normalizedCategory: string;
  passengerCapacity: number;
  luggageCapacity: string;
  transmission: string;
  fuelType: string;
  images: string[];
  specs: string[];
  features: string[];
  description: string;
  availabilityForRent: boolean;
  availabilityForSale: boolean;
  salePrice?: number;
  year: number;
  mileage: number;
  licensePlate: string;
  rentalStatus: string;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    user: { name: string };
    createdAt: string;
    isVerified: boolean;
  }>;
  averageRating: number;
  totalReviews: number;
}

export default function CarDetailsPage() {
  const params = useParams();
  const carId = params?.id as string;
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!carId) return;
      
      try {
        const response = await fetch(`/api/cars/${carId}`);
        if (response.ok) {
          const carData = await response.json();
          setCar(carData);
        } else {
          console.error('Car not found');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays();
  const totalCost = car ? days * car.costPerDay : 0;

  const handleBookNow = () => {
    if (startDate && endDate && car) {
      const searchParams = new URLSearchParams({
        carId: car.id,
        startDate,
        endDate,
        days: days.toString(),
        totalCost: totalCost.toString()
      });
      window.location.href = `/booking/checkout?${searchParams.toString()}`;
    } else {
      setShowBookingForm(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-responsive py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-muted rounded-xl"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Car Not Found</h1>
          <p className="text-muted-foreground mb-6">The car you're looking for doesn't exist.</p>
          <Link href="/cars">
            <Button variant="primary">Browse All Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-responsive py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/cars" className="hover:text-primary flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Cars
          </Link>
          <span>/</span>
          <span>{car.brand}</span>
          <span>/</span>
          <span className="text-foreground">{car.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
              <Image
                src={car.images[selectedImageIndex] || '/placeholder-car.jpg'}
                alt={car.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Availability Badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  car.availabilityForRent && car.rentalStatus === 'AVAILABLE'
                    ? 'bg-success-50 text-success border border-success/20'
                    : 'bg-warning-50 text-warning border border-warning/20'
                }`}>
                  {car.availabilityForRent && car.rentalStatus === 'AVAILABLE' ? 'Available' : 'Unavailable'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {car.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${car.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{car.name}</h1>
                {car.averageRating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{car.averageRating}</span>
                    <span className="text-muted-foreground">({car.totalReviews})</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground">{car.brand} • {car.normalizedCategory} • {car.year}</p>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">${car.costPerDay}</span>
                <span className="text-muted-foreground">/day</span>
              </div>
              {car.costIfExtend < car.costPerDay && (
                <p className="text-sm text-muted-foreground">
                  Extended rental: ${car.costIfExtend}/day (10% discount)
                </p>
              )}
              {car.availabilityForSale && car.salePrice && (
                <p className="text-sm font-medium text-secondary">
                  Purchase price: ${car.salePrice.toLocaleString()}
                </p>
              )}
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span>{car.passengerCapacity} passengers</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-muted-foreground" />
                <span>{car.fuelType}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span>{car.luggageCapacity}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">About this vehicle</h3>
              <p className="text-muted-foreground">{car.description}</p>
            </div>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Book This Vehicle</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      fullWidth
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      fullWidth
                      min={startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {days > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span>Duration: {days} day{days > 1 ? 's' : ''}</span>
                      <span className="font-semibold">Total: ${totalCost}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth
                  disabled={!car.availabilityForRent || !days}
                  onClick={handleBookNow}
                >
                  {car.availabilityForRent ? 'Book Now' : 'Unavailable'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Specifications */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Specifications</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {car.specs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{spec}</span>
                  </div>
                ))}
                <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                  <div>Year: {car.year}</div>
                  <div>Mileage: {car.mileage.toLocaleString()} miles</div>
                  <div>License: {car.licensePlate}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Features & Amenities</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-success" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Summary */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Customer Reviews</h3>
            </CardHeader>
            <CardContent>
              {car.reviews.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{car.averageRating}</div>
                    <div className="flex justify-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= car.averageRating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {car.totalReviews} reviews
                    </div>
                  </div>

                  <div className="space-y-3">
                    {car.reviews.slice(0, 2).map(review => (
                      <div key={review.id} className="border-t pt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{review.user.name}</span>
                          {review.isVerified && (
                            <Award className="w-3 h-3 text-success" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No reviews yet. Be the first to review this vehicle!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}