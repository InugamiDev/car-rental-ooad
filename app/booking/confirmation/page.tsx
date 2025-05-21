import Link from 'next/link';

const BookingConfirmationPage = () => {
  // Mock data - in a real app, this might come from state or query params
  const mockBookingID = 'MOCK-XYZ123';
  const mockCarName = 'Toyota Vios';
  const mockDates = 'June 10, 2025 - June 13, 2025'; // Example dates
  const mockPointsEarned = 6000;

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-8 md:p-10 rounded-xl shadow-2xl text-center">
        <div className="mb-6">
          {/* Using a simple emoji or you can use an SVG icon */}
          <span className="text-6xl" role="img" aria-label="Party Popper">🎉</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
          Your Mock Booking is Confirmed!
        </h1>
        <p className="text-gray-700 mb-2">
          Booking ID: <span className="font-semibold text-gray-800">{mockBookingID}</span>
        </p>
        <div className="bg-blue-50 p-4 rounded-lg my-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Booking Summary:</h2>
          <p className="text-gray-600">Car: <span className="font-medium">{mockCarName}</span></p>
          <p className="text-gray-600">Dates: <span className="font-medium">{mockDates}</span></p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg my-6 border border-orange-200">
          <h2 className="text-lg font-semibold text-orange-600 mb-2">Points Earned:</h2>
          <p className="text-gray-700">
            Well done! You&apos;re set to earn <span className="font-bold text-orange-500 text-xl">{mockPointsEarned.toLocaleString()} Driving Points</span> for this trip.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            These will be (notionally) added to your account after your rental.
          </p>
        </div>

        <div className="mt-8 space-y-3 md:space-y-0 md:flex md:space-x-4 justify-center">
          <Link href="/account" legacyBehavior>
            <a className="block w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out">
              View My Account
            </a>
          </Link>
          <Link href="/" legacyBehavior>
            <a className="block w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out">
              Back to Homepage
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;