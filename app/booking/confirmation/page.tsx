'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DrivingSimulator from '@/components/DrivingSimulator';
import { calculateDistance } from '@/lib/utils';

interface BookingDetails {
  id: string;
  car: {
    id: string;
    name: string;
    brand: string;
  };
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalCost: number;
  status: string;
  estimatedDistance?: number;
}

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookingDetails() {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const data = await response.json();
        
        // Calculate estimated distance based on pickup and dropoff locations
        const estimatedDistance = data.pickupLocation && data.dropoffLocation 
          ? calculateDistance(data.pickupLocation, data.dropoffLocation)
          : 50; // Default distance if locations not provided

        setBooking({
          ...data,
          estimatedDistance
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    }

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error || 'Booking not found'}</p>
          <Link href="/" className="inline-block bg-primary text-white font-semibold py-3 px-6 rounded-md shadow-md hover:bg-primary/90 transition duration-150">
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block" role="img" aria-label="Party Popper">🎉</span>
          <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
            Your Booking is Confirmed!
          </h1>
          <p className="text-gray-700 mb-2">
            Booking ID: <span className="font-semibold text-gray-800">{booking.id}</span>
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Booking Summary</h2>
          <div className="space-y-3">
            <p className="text-gray-600">
              <span className="font-medium">Car:</span> {booking.car.brand} {booking.car.name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Dates:</span> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Pickup:</span> {booking.pickupLocation}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Drop-off:</span> {booking.dropoffLocation}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Total Cost:</span> ${booking.totalCost.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Simulate Your Journey</h2>
          <p className="text-gray-600 mb-4">
            Estimate your potential loyalty points based on your driving behavior during the {booking.estimatedDistance}km journey.
          </p>
          <DrivingSimulator 
            distance={booking.estimatedDistance || 50}
            onSimulationComplete={(results) => {
              console.log('Simulation results:', results);
              // You could store these results or update UI based on them
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/account"
            className="bg-primary text-white text-center font-semibold py-3 px-6 rounded-md shadow-md hover:bg-primary/90 transition duration-150"
          >
            View My Account
          </Link>
          <Link 
            href="/"
            className="bg-gray-200 text-gray-700 text-center font-semibold py-3 px-6 rounded-md shadow-md hover:bg-gray-300 transition duration-150"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}