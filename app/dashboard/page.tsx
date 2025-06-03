'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Car, Star, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface Booking {
  id: string;
  car: {
    name: string;
    brand: string;
  };
  startDate: string;
  endDate: string;
  status: string;
  totalCost: number;
}

interface UserStats {
  totalBookings: number;
  loyaltyPoints: number;
  membershipTier: string;
  totalSpent: number;
}

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user) {
      // In a real app, these would be API calls
      // For now, using mock data
      const mockBookings: Booking[] = [
        {
          id: 'B001',
          car: { name: 'Camry 2023', brand: 'Toyota' },
          startDate: '2024-06-01',
          endDate: '2024-06-03',
          status: 'Completed',
          totalCost: 150
        },
        {
          id: 'B002',
          car: { name: 'Civic 2022', brand: 'Honda' },
          startDate: '2024-06-15',
          endDate: '2024-06-17',
          status: 'Confirmed',
          totalCost: 120
        },
        {
          id: 'B003',
          car: { name: 'Model 3', brand: 'Tesla' },
          startDate: '2024-07-01',
          endDate: '2024-07-05',
          status: 'Pending',
          totalCost: 400
        }
      ];

      const mockStats: UserStats = {
        totalBookings: 8,
        loyaltyPoints: 1250,
        membershipTier: 'Gold',
        totalSpent: 2840
      };

      setBookings(mockBookings);
      setUserStats(mockStats);
      setLoading(false);
    }
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const getStatusColor = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'confirmed':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return 'text-purple-600';
      case 'gold':
        return 'text-yellow-600';
      case 'silver':
        return 'text-gray-600';
      default:
        return 'text-amber-600';
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {session.user.name || 'User'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your bookings and track your rewards
          </p>
        </div>
        <Link href="/cars">
          <Button variant="primary" className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            Find a Car
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{userStats.totalBookings}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Loyalty Points</p>
                  <p className="text-2xl font-bold">{userStats.loyaltyPoints.toLocaleString()}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Membership</p>
                  <p className={`text-2xl font-bold ${getTierColor(userStats.membershipTier)}`}>
                    {userStats.membershipTier}
                  </p>
                </div>
                <Award className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">${userStats.totalSpent.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
            <Link href="/account">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No bookings yet</p>
                <Link href="/cars" className="inline-block mt-4">
                  <Button variant="primary">Book Your First Car</Button>
                </Link>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-medium text-foreground">
                          {booking.car.brand} {booking.car.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {booking.startDate} - {booking.endDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${booking.totalCost}</p>
                      <Badge variant={getStatusColor(booking.status)} size="sm">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <Link href="/rewards">
        <CardContent className="p-8 text-center">
          <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">Loyalty Rewards</h3>
          <p className="text-muted-foreground">
            Redeem your points and unlock exclusive rewards
          </p>
        </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <Link href="/cars">
        <CardContent className="p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Car className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">Book a Car</h3>
          <p className="text-muted-foreground">
            Find and reserve your perfect vehicle today
          </p>
        </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;