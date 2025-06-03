'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar, MapPin, CreditCard, Shield,
  ArrowLeft, AlertCircle, Users, Fuel, Settings
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';

interface Car {
  id: string;
  name: string;
  brand: string;
  price: number;
  costIfExtend: number;
  normalizedCategory: string;
  passengerCapacity: number;
  transmission: string;
  fuelType: string;
  images: string[];
  specs: string[];
  availabilityForRent: boolean;
  rentalStatus: string;
}

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const carId = searchParams?.get('carId');
  const startDate = searchParams?.get('startDate');
  const endDate = searchParams?.get('endDate');

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    startDate: startDate || '',
    endDate: endDate || '',
    pickupLocation: '',
    dropoffLocation: '',
    specialRequests: '',
    // Personal info (if not logged in)
    fullName: '',
    email: '',
    phone: '',
    driverLicense: '',
    // Payment info
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!carId) return;
      
      try {
        const response = await fetch(`/api/cars/${carId}`);
        if (response.ok) {
          const carData = await response.json();
          setCar(carData);
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const calculateBookingDetails = () => {
    if (!formData.startDate || !formData.endDate || !car) {
      return { days: 0, subtotal: 0, taxes: 0, total: 0 };
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const subtotal = days * car.price;
    const taxes = subtotal * 0.12; // 12% tax
    const total = subtotal + taxes;

    return { days, subtotal, taxes, total };
  };

  const { days, subtotal, taxes, total } = calculateBookingDetails();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.driverLicense) newErrors.driverLicense = 'Driver license is required';
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv) newErrors.cvv = 'CVV is required';
    if (!formData.cardholderName) newErrors.cardholderName = 'Cardholder name is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Please agree to terms and conditions';

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !car) return;

    setBookingLoading(true);
    
    try {
      const bookingData = {
        carId: car.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        pickupLocation: formData.pickupLocation || 'Main Office',
        dropoffLocation: formData.dropoffLocation || 'Main Office',
        specialRequests: formData.specialRequests,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to confirmation page
        window.location.href = `/booking/confirmation?bookingId=${result.booking.id}`;
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error.message || 'Failed to create booking' });
      }
    } catch {
      setErrors({ submit: 'An error occurred while creating your booking' });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-responsive py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
              <div className="h-96 bg-muted rounded"></div>
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
          <p className="text-muted-foreground mb-6">Unable to load car details for booking.</p>
          <Link href="/cars">
            <Button variant="primary">Browse Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href={`/cars/${car.id}`} className="hover:text-primary flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to {car.name}
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">Complete Your Booking</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Rental Details */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Rental Details
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Pickup Date"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        error={errors.startDate}
                        min={new Date().toISOString().split('T')[0]}
                        fullWidth
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Return Date"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        error={errors.endDate}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        fullWidth
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Pickup Location"
                        placeholder="Main Office (default)"
                        leftIcon={MapPin}
                        value={formData.pickupLocation}
                        onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                        fullWidth
                      />
                    </div>
                    <div>
                      <Input
                        label="Drop-off Location"
                        placeholder="Same as pickup (default)"
                        leftIcon={MapPin}
                        value={formData.dropoffLocation}
                        onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                        fullWidth
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Special Requests</label>
                    <textarea
                      className="input w-full min-h-[100px] resize-y"
                      placeholder="Any special requests or requirements..."
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Full Name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        error={errors.fullName}
                        fullWidth
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        fullWidth
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        error={errors.phone}
                        fullWidth
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Driver License Number"
                        value={formData.driverLicense}
                        onChange={(e) => handleInputChange('driverLicense', e.target.value)}
                        error={errors.driverLicense}
                        fullWidth
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Input
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      error={errors.cardNumber}
                      fullWidth
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Expiry Date"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        error={errors.expiryDate}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="CVV"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        error={errors.cvv}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Cardholder Name"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      error={errors.cardholderName}
                      fullWidth
                      required
                    />
                  </div>

                  <div>
                    <Input
                      label="Billing Address"
                      value={formData.billingAddress}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                      fullWidth
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className="mt-1"
                        required
                      />
                      <span className="text-sm">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-error">{errors.agreeToTerms}</p>
                    )}

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.subscribeNewsletter}
                        onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm text-muted-foreground">
                        Subscribe to our newsletter for special offers and updates
                      </span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  {errors.submit && (
                    <div className="flex items-center gap-2 text-error mb-4">
                      <AlertCircle className="w-5 h-5" />
                      <span>{errors.submit}</span>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={bookingLoading}
                    disabled={!days || bookingLoading}
                  >
                    {bookingLoading ? 'Processing...' : `Complete Booking - $${total.toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              {/* Car Summary */}
              <Card className="sticky top-4">
                <CardHeader>
                  <h3 className="font-semibold">Booking Summary</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Car Info */}
                  <div className="flex gap-4">
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={car.images[0] || '/placeholder-car.jpg'}
                        alt={car.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{car.name}</h4>
                      <p className="text-sm text-muted-foreground">{car.brand} • {car.normalizedCategory}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {car.passengerCapacity}
                        </span>
                        <span className="flex items-center gap-1">
                          <Settings className="w-3 h-3" />
                          {car.transmission}
                        </span>
                        <span className="flex items-center gap-1">
                          <Fuel className="w-3 h-3" />
                          {car.fuelType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  {formData.startDate && formData.endDate && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Pickup:</span>
                        <span>{new Date(formData.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Return:</span>
                        <span>{new Date(formData.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Duration:</span>
                        <span>{days} day{days > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  {days > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Daily rate:</span>
                        <span>${car.price}/day</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({days} days):</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxes & fees:</span>
                        <span>${taxes.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <div className="flex items-center gap-2 text-sm text-success">
                    <Shield className="w-4 h-4" />
                    <span>Secure payment protected by SSL</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <div className="container-responsive py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}