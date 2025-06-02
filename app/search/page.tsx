import CarCard from '@/components/CarCard';

const SearchPage = () => {
  // Mock car data - transform to match CarCard interface
  const mockCars = [
    {
      id: '1',
      name: 'Toyota Vios 2024',
      brand: 'Toyota',
      model: 'Vios',
      costPerDay: 75,
      normalizedCategory: 'Sedan',
      passengerCapacity: 5,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      images: ['/placeholder-car.jpg'],
      specs: ['5 Seats', 'Automatic', 'Air Conditioning', 'Bluetooth'],
      availabilityForRent: true,
      availabilityForSale: false,
      averageRating: 4.5,
      totalReviews: 23,
      rentalStatus: 'AVAILABLE',
    },
    {
      id: '2',
      name: 'Mitsubishi Xpander 2023',
      brand: 'Mitsubishi',
      model: 'Xpander',
      costPerDay: 95,
      normalizedCategory: 'SUV',
      passengerCapacity: 7,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      images: ['/placeholder-car.jpg'],
      specs: ['7 Seats', 'Automatic', 'Air Conditioning', 'USB Charging'],
      availabilityForRent: true,
      availabilityForSale: false,
      averageRating: 4.7,
      totalReviews: 34,
      rentalStatus: 'AVAILABLE',
    },
    {
      id: '3',
      name: 'VinFast Fadil 2023',
      brand: 'VinFast',
      model: 'Fadil',
      costPerDay: 60,
      normalizedCategory: 'Hatchback',
      passengerCapacity: 5,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      images: ['/placeholder-car.jpg'],
      specs: ['5 Seats', 'Automatic', 'Air Conditioning', 'Compact Size'],
      availabilityForRent: true,
      availabilityForSale: false,
      averageRating: 4.2,
      totalReviews: 18,
      rentalStatus: 'AVAILABLE',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Find Your Perfect Ride</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mock Filter Options */}
        <aside className="w-full md:w-1/4 p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Refine Your Search (Mock Filters)</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-gray-600">Type:</h3>
              <p className="text-sm text-gray-500">Compact, Sedan, SUV</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Price:</h3>
              <p className="text-sm text-gray-500">(Show mock range)</p>
            </div>
            {/* Add more mock filters as needed */}
          </div>
        </aside>

        {/* Car Listing Area */}
        <main className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                variant="default"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;