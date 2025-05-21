import HeroSection from '@/components/HeroSection';
import Link from 'next/link'; // Added for CTA button

// Mock icons - replace with actual icon components if available
const IconPlaceholder = ({ className = "w-12 h-12 text-blue-500" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);


export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* How Driving Distance Exchange Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            Drive. Earn. Redeem. It's Rewardingly Simple!
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
              <IconPlaceholder className="w-16 h-16 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Book & Drive</h3>
              <p className="text-gray-600">
                Select your ideal car for exploring Vietnam.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
              <IconPlaceholder className="w-16 h-16 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Collect Points</h3>
              <p className="text-gray-600">
                Earn <span className="font-bold">10 Points</span> for every kilometer you travel!
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
              <IconPlaceholder className="w-16 h-16 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Enjoy Rewards</h3>
              <p className="text-gray-600">
                Use points for rental discounts, car upgrades & more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us? Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            Travel Smarter With Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start p-6 bg-white rounded-lg shadow-lg">
              <IconPlaceholder className="w-12 h-12 text-blue-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Unique Kilometer Rewards</h3>
                <p className="text-gray-600">
                  Your road trips pay you back.
                </p>
              </div>
            </div>
            <div className="flex items-start p-6 bg-white rounded-lg shadow-lg">
              <IconPlaceholder className="w-12 h-12 text-blue-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Simple & Clear Booking</h3>
                <p className="text-gray-600">
                  No fuss, just straightforward renting.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Link href="/rewards" legacyBehavior>
              <a className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-md shadow-md transition duration-150 ease-in-out text-lg">
                Discover Your Driving Rewards
              </a>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
