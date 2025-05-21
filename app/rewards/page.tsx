// Mock icon placeholder - replace with actual icons if available
const IconPlaceholder = ({ className = "w-10 h-10 text-orange-500" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const RewardsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            Driving Distance Exchange
          </h1>
          <p className="text-xl md:text-2xl text-gray-700">
            Turn Kilometers into Amazing Rewards!
          </p>
        </section>

        {/* How to Earn Points Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">How to Earn Points</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <IconPlaceholder className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-700">1. Rent Any Car</h3>
              <p className="text-gray-600">All our vehicles qualify for points. Just pick your favorite and hit the road!</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <IconPlaceholder className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-700">2. Drive & Explore</h3>
              <p className="text-gray-600">Enjoy your journey through the beautiful landscapes of Vietnam.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <IconPlaceholder className="w-16 h-16 text-orange-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-700">3. Get Rewarded</h3>
              <p className="text-gray-600">
                We'll (notionally) calculate <span className="font-bold text-orange-600">10 Points for EVERY kilometer</span> you drive.
              </p>
            </div>
          </div>
        </section>

        {/* What You Can Redeem Section */}
        <section>
          <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">What You Can Redeem</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Reward Card 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-center mb-4">
                  <IconPlaceholder className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Rental Discounts</h3>
                <p className="text-gray-600 text-sm text-center">
                  <span className="font-bold">5,000 Points</span> = <span className="font-bold text-green-600">100,000 VND Off</span> Next Rental!
                </p>
              </div>
              <div className="bg-gray-50 p-3 text-center">
                <span className="text-xs text-gray-500">Save on your travels</span>
              </div>
            </div>

            {/* Reward Card 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-center mb-4">
                  <IconPlaceholder className="w-12 h-12 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Car Upgrades</h3>
                <p className="text-gray-600 text-sm text-center">
                  <span className="font-bold">15,000 Points</span> = <span className="font-bold text-purple-600">Free Upgrade</span> to an SUV!
                </p>
              </div>
              <div className="bg-gray-50 p-3 text-center">
                <span className="text-xs text-gray-500">Ride in style</span>
              </div>
            </div>

            {/* Reward Card 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-center mb-4">
                  <IconPlaceholder className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Travel Vouchers</h3>
                <p className="text-gray-600 text-sm text-center">
                  <span className="font-bold">20,000 Points</span> = <span className="font-bold text-red-600">Voucher</span> for Partner Hotels!
                </p>
              </div>
              <div className="bg-gray-50 p-3 text-center">
                <span className="text-xs text-gray-500">Extend your stay</span>
              </div>
            </div>

            {/* Reward Card 4 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-center mb-4">
                  <IconPlaceholder className="w-12 h-12 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Exclusive Merchandise</h3>
                <p className="text-gray-600 text-sm text-center">
                  <span className="font-bold">8,000 Points</span> = <span className="font-bold text-yellow-600">'Vietnam Wheels' Travel Kit!</span>
                </p>
              </div>
              <div className="bg-gray-50 p-3 text-center">
                <span className="text-xs text-gray-500">Cool travel gear</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RewardsPage;