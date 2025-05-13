import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="py-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Featured Vehicles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 shadow-sm">
            <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Vehicle Name</h3>
            <p className="text-sm text-gray-600">Short description or key specs.</p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm">
            <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Vehicle Name</h3>
            <p className="text-sm text-gray-600">Short description or key specs.</p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm">
            <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Vehicle Name</h3>
            <p className="text-sm text-gray-600">Short description or key specs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
