import CarCard from '@/components/CarCard'; // Assuming CarCard will be created/updated

const SearchPage = () => {
  // Mock car data - replace with actual data fetching later
  const mockCars = [
    {
      id: '1',
      name: 'Toyota Vios',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Toyota+Vios',
      specs: [{ label: '5 Seats' }, { label: 'Automatic' }],
      pricePerDay: '750,000 VND',
      pointsPerDay: '~600',
    },
    {
      id: '2',
      name: 'Mitsubishi Xpander',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Mitsubishi+Xpander',
      specs: [{ label: '7 Seats' }, { label: 'Automatic' }],
      pricePerDay: '900,000 VND',
      pointsPerDay: '~720',
    },
    {
      id: '3',
      name: 'VinFast Fadil',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=VinFast+Fadil',
      specs: [{ label: '5 Seats' }, { label: 'Automatic' }],
      pricePerDay: '600,000 VND',
      pointsPerDay: '~480',
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
                id={car.id}
                name={car.name}
                imageUrl={car.imageUrl}
                specs={car.specs}
                pricePerDay={car.pricePerDay}
                pointsPerDay={car.pointsPerDay}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;