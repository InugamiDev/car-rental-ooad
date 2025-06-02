'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DrivingSimulator from '@/components/DrivingSimulator';
import { formatCurrency, formatDate } from '@/lib/utils';

interface UserProfile {
  name: string;
  email: string;
  loyaltyPoints: number;
  membershipTier: string;
  nextTier: string | null;
  pointsToNextTier: number;
  rentalHistory: {
    id: string;
    description: string;
    startDate: string;
    endDate: string;
    distanceKm: number;
    pointsEarned: number;
  }[];
  recentTransactions: {
    id: string;
    points: number;
    transactionType: string;
    description: string;
    createdAt: string;
  }[];
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/login');
    }

    if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [status]);

  async function fetchUserProfile() {
    try {
      const response = await fetch('/api/users/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => fetchUserProfile()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Welcome Message */}
        <section className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome Back, <span className="text-primary">{profile.name}</span>!
          </h1>
        </section>

        {/* Points Balance Section */}
        <section className="mb-10 bg-white p-8 rounded-xl shadow-xl text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Your Driving Rewards Balance:</h2>
          <p className="text-5xl md:text-6xl font-bold text-primary mb-3">
            {profile.loyaltyPoints.toLocaleString()} <span className="text-3xl">Points</span>
          </p>
          <div className="text-gray-600">
            <p className="mb-2">Current Tier: <span className="font-semibold text-primary">{profile.membershipTier}</span></p>
            {profile.nextTier && (
              <p>
                {profile.pointsToNextTier.toLocaleString()} points until {profile.nextTier} tier!
              </p>
            )}
          </div>
        </section>

        {/* Recent Trips Section */}
        <section className="bg-white p-8 rounded-xl shadow-xl mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Recent Adventures</h2>
          {profile.rentalHistory.length > 0 ? (
            <div className="space-y-6">
              {profile.rentalHistory.map((rental) => (
                <div key={rental.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{rental.description}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                      </p>
                      <p className="text-sm text-gray-500">Distance: {rental.distanceKm}km</p>
                    </div>
                    <p className="text-lg font-semibold text-green-600 mt-2 sm:mt-0">
                      +{rental.pointsEarned.toLocaleString()} Points
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No trips yet. Time to plan your first adventure!</p>
          )}
        </section>

        {/* Recent Points Activity */}
        <section className="bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Points Activity</h2>
          <div className="space-y-4">
            {profile.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center border-b border-gray-100 py-3">
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                </div>
                <p className={`font-semibold ${
                  transaction.transactionType === 'EARNED' || transaction.transactionType === 'BONUS' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.transactionType === 'EARNED' || transaction.transactionType === 'BONUS' ? '+' : '-'}
                  {Math.abs(transaction.points).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}