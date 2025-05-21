const AccountPage = () => {
  const mockUserName = "Explorer Extraordinaire"; // Mock user name
  const mockPointsBalance = 18500;
  const mockNextReward = "Voucher for Partner Hotels (20,000 Points)";

  const mockRentalHistory = [
    {
      id: 'trip1',
      description: 'Hanoi City Tour - Kia Morning',
      distanceKm: 150,
      pointsEarned: 1500,
      date: 'May 10, 2025',
    },
    {
      id: 'trip2',
      description: 'Da Nang Coastal Drive - Mazda 2',
      distanceKm: 250,
      pointsEarned: 2500,
      date: 'April 22, 2025',
    },
    {
      id: 'trip3',
      description: 'Mekong Delta Exploration - Toyota Fortuner',
      distanceKm: 320,
      pointsEarned: 3200,
      date: 'March 05, 2025',
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Welcome Message */}
        <section className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome Back, <span className="text-blue-600">{mockUserName}</span>!
          </h1>
        </section>

        {/* Points Balance Section */}
        <section className="mb-10 bg-white p-8 rounded-xl shadow-xl text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Your Driving Rewards Balance:</h2>
          <p className="text-5xl md:text-6xl font-bold text-orange-500 mb-3">
            {mockPointsBalance.toLocaleString()} <span className="text-3xl">Points</span>
          </p>
          <p className="text-gray-600">
            You&apos;re close to: <span className="font-semibold text-green-600">{mockNextReward}</span>!
          </p>
        </section>

        {/* Mock Rental History Section */}
        <section className="bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Past Adventures & Points</h2>
          {mockRentalHistory.length > 0 ? (
            <div className="space-y-6">
              {mockRentalHistory.map((rental) => (
                <div key={rental.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-700">{rental.description}</h3>
                      <p className="text-sm text-gray-500">Date: {rental.date} &bull; Distance: {rental.distanceKm}km</p>
                    </div>
                    <p className="text-lg font-semibold text-green-600 mt-2 sm:mt-0">
                      Earned: +{rental.pointsEarned.toLocaleString()} Points
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No rental history yet. Start a trip to earn points!</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default AccountPage;