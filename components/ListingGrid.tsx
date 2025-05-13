import CarCard from './CarCard';

const sampleCars = [
  { id: '1', imageUrl: 'https://via.placeholder.com/300x200.png?text=Sedan', title: 'Reliable Sedan', price: '$25,000', specs: [{ label: '4-door' }, { label: 'Auto' }, { label: 'Petrol' }], isRental: false },
  { id: '2', imageUrl: 'https://via.placeholder.com/300x200.png?text=SUV', title: 'Spacious SUV', price: '$35,000', specs: [{ label: '5-door' }, { label: 'AWD' }, { label: 'Diesel' }], isRental: false },
  { id: '3', imageUrl: 'https://via.placeholder.com/300x200.png?text=Hatchback', title: 'City Hatchback', price: '$50/day', specs: [{ label: '5-door' }, { label: 'Manual' }, { label: 'Hybrid' }], isRental: true },
  { id: '4', imageUrl: 'https://via.placeholder.com/300x200.png?text=Luxury+Car', title: 'Luxury Cruiser', price: '$150/day', specs: [{ label: '2-door' }, { label: 'Auto' }, { label: 'Petrol' }], isRental: true },
  { id: '5', imageUrl: 'https://via.placeholder.com/300x200.png?text=Van', title: 'Family Van', price: '$40,000', specs: [{ label: '7-seater' }, { label: 'Auto' }, { label: 'Diesel' }], isRental: false },
  { id: '6', imageUrl: 'https://via.placeholder.com/300x200.png?text=Convertible', title: 'Sporty Convertible', price: '$120/day', specs: [{ label: '2-door' }, { label: 'Auto' }, { label: 'Petrol' }], isRental: true },
];

interface ListingGridProps {
}

const ListingGrid: React.FC<ListingGridProps> = () => {
  const cars = sampleCars;

  return (
    <div className="flex-grow p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">All Vehicles ({cars.length})</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            imageUrl={car.imageUrl}
            title={car.title}
            price={car.price}
            specs={car.specs}
            isRental={car.isRental}
          />
        ))}
      </div>
    </div>
  );
};

export default ListingGrid;