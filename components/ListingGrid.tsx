import CarCard from './CarCard';

const sampleCars = [
  { id: '1', imageUrl: 'https://via.placeholder.com/300x200.png?text=Sedan', name: 'Reliable Sedan', pricePerDay: '$25,000', specs: [{ label: '4-door' }, { label: 'Auto' }, { label: 'Petrol' }], pointsPerDay: '~200', isRental: false },
  { id: '2', imageUrl: 'https://via.placeholder.com/300x200.png?text=SUV', name: 'Spacious SUV', pricePerDay: '$35,000', specs: [{ label: '5-door' }, { label: 'AWD' }, { label: 'Diesel' }], pointsPerDay: '~300', isRental: false },
  { id: '3', imageUrl: 'https://via.placeholder.com/300x200.png?text=Hatchback', name: 'City Hatchback', pricePerDay: '$50/day', specs: [{ label: '5-door' }, { label: 'Manual' }, { label: 'Hybrid' }], pointsPerDay: '~50', isRental: true },
  { id: '4', imageUrl: 'https://via.placeholder.com/300x200.png?text=Luxury+Car', name: 'Luxury Cruiser', pricePerDay: '$150/day', specs: [{ label: '2-door' }, { label: 'Auto' }, { label: 'Petrol' }], pointsPerDay: '~150', isRental: true },
  { id: '5', imageUrl: 'https://via.placeholder.com/300x200.png?text=Van', name: 'Family Van', pricePerDay: '$40,000', specs: [{ label: '7-seater' }, { label: 'Auto' }, { label: 'Diesel' }], pointsPerDay: '~350', isRental: false },
  { id: '6', imageUrl: 'https://via.placeholder.com/300x200.png?text=Convertible', name: 'Sporty Convertible', pricePerDay: '$120/day', specs: [{ label: '2-door' }, { label: 'Auto' }, { label: 'Petrol' }], pointsPerDay: '~120', isRental: true },
];

interface ListingGridProps extends Object { // Changed to Object to satisfy linter for empty interface
  // Props for ListingGrid, if any, would go here.
  // For now, it uses predefined sampleCars.
}

const ListingGrid: React.FC<ListingGridProps> = () => {
  const cars = sampleCars; // In a real app, this would likely come from props or state

  return (
    <div className="flex-grow p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">All Vehicles ({cars.length})</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            id={car.id} // Added id prop
            imageUrl={car.imageUrl}
            name={car.name} // Changed from title to name
            pricePerDay={car.pricePerDay} // Changed from price to pricePerDay
            specs={car.specs}
            pointsPerDay={car.pointsPerDay} // Added pointsPerDay
            // isRental prop is no longer used in CarCard as per previous update,
            // The button logic is now "View & Book"
          />
        ))}
      </div>
    </div>
  );
};

export default ListingGrid;