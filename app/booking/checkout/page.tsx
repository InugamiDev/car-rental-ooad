'use client'; // For potential client-side interactions like form handling or query params

import { useSearchParams } from 'next/navigation'; // To get carId if passed
import Link from 'next/link';

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const carId = searchParams.get('carId'); // Example: get carId from URL

  // Mock data - in a real app, fetch car details based on carId
  const mockCarName = carId ? `Toyota Vios (ID: ${carId})` : 'Toyota Vios';
  const mockRentalDays = 3;
  const mockCostPerDay = 750000; // VND
  const mockTotalCost = mockCostPerDay * mockRentalDays;
  const mockPointsPerDay = 2000; // Example points for this car per day
  const mockTotalPoints = mockPointsPerDay * mockRentalDays;

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Complete Your Mock Booking
        </h1>

        {/* Rental Summary */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">Rental Summary</h2>
          <p className="text-gray-700">
            You&apos;re booking: <span className="font-semibold">{mockCarName}</span> for <span className="font-semibold">{mockRentalDays} Days</span> (Mock)
          </p>
        </div>

        {/* Simplified Renter Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Renter Information (Mock)</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name:</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                defaultValue="Project User" 
                readOnly
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email:</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                defaultValue="user@example.com"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Cost & Points Display */}
        <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Cost & Points</h2>
          <p className="text-gray-700 text-lg">
            Total Mock Cost: <span className="font-bold text-green-600">{mockTotalCost.toLocaleString()} VND</span>
          </p>
          <p className="text-gray-700 text-lg mt-2">
            Estimated Points Earning for this Trip: 
            <span className="font-bold text-orange-500 text-xl"> {mockTotalPoints.toLocaleString()} Points!</span>
          </p>
        </div>

        {/* Mock Payment Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Payment Information</h2>
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="text-gray-600">Payment Method: Simulated Secure Checkout (No details needed for mock-up)</p>
          </div>
        </div>

        {/* Confirmation Button */}
        <Link href="/booking/confirmation" legacyBehavior>
          <a className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center font-bold py-4 px-6 rounded-lg text-xl shadow-lg transition duration-150 ease-in-out">
            Confirm Mock Rental & Earn Points
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutPage;