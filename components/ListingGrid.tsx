import CarCard from './CarCard';

const sampleCars = [
  {
    id: '1',
    name: 'Reliable Sedan 2024',
    brand: 'Honda',
    model: 'Civic',
    costPerDay: 75,
    normalizedCategory: 'Sedan',
    passengerCapacity: 4,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: ['/placeholder-car.jpg'],
    specs: ['4-door', 'Automatic', 'Air Conditioning', 'Bluetooth'],
    availabilityForRent: true,
    availabilityForSale: true,
    salePrice: 25000,
    averageRating: 4.3,
    totalReviews: 15,
    rentalStatus: 'AVAILABLE',
  },
  {
    id: '2',
    name: 'Spacious SUV 2023',
    brand: 'Toyota',
    model: 'RAV4',
    costPerDay: 95,
    normalizedCategory: 'SUV',
    passengerCapacity: 5,
    transmission: 'AWD',
    fuelType: 'Hybrid',
    images: ['/placeholder-car.jpg'],
    specs: ['5-door', 'AWD', 'Hybrid Engine', 'Safety Pack'],
    availabilityForRent: true,
    availabilityForSale: true,
    salePrice: 35000,
    averageRating: 4.6,
    totalReviews: 28,
    rentalStatus: 'AVAILABLE',
  },
  {
    id: '3',
    name: 'City Hatchback 2024',
    brand: 'Nissan',
    model: 'Micra',
    costPerDay: 50,
    normalizedCategory: 'Hatchback',
    passengerCapacity: 5,
    transmission: 'Manual',
    fuelType: 'Gasoline',
    images: ['/placeholder-car.jpg'],
    specs: ['5-door', 'Manual', 'Compact Size', 'Fuel Efficient'],
    availabilityForRent: true,
    availabilityForSale: false,
    averageRating: 4.1,
    totalReviews: 12,
    rentalStatus: 'AVAILABLE',
  },
  {
    id: '4',
    name: 'Luxury Cruiser 2023',
    brand: 'BMW',
    model: 'X5',
    costPerDay: 150,
    normalizedCategory: 'Luxury',
    passengerCapacity: 5,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    images: ['/placeholder-car.jpg'],
    specs: ['Premium Interior', 'Automatic', 'Luxury Package', 'Navigation'],
    availabilityForRent: true,
    availabilityForSale: false,
    averageRating: 4.8,
    totalReviews: 22,
    rentalStatus: 'AVAILABLE',
  },
  {
    id: '5',
    name: 'Family Van 2024',
    brand: 'Ford',
    model: 'Transit',
    costPerDay: 85,
    normalizedCategory: 'Van',
    passengerCapacity: 7,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    images: ['/placeholder-car.jpg'],
    specs: ['7-seater', 'Automatic', 'Large Cargo', 'Family Friendly'],
    availabilityForRent: true,
    availabilityForSale: true,
    salePrice: 40000,
    averageRating: 4.4,
    totalReviews: 18,
    rentalStatus: 'AVAILABLE',
  },
  {
    id: '6',
    name: 'Sporty Convertible 2023',
    brand: 'Mazda',
    model: 'MX-5',
    costPerDay: 120,
    normalizedCategory: 'Convertible',
    passengerCapacity: 2,
    transmission: 'Manual',
    fuelType: 'Gasoline',
    images: ['/placeholder-car.jpg'],
    specs: ['2-door', 'Manual', 'Sport Mode', 'Convertible Top'],
    availabilityForRent: true,
    availabilityForSale: false,
    averageRating: 4.7,
    totalReviews: 31,
    rentalStatus: 'AVAILABLE',
  },
];

// Using Record<string, never> for an object type that should have no properties.
// This is often preferred over an empty interface for clarity in such cases.
type ListingGridProps = Record<string, never>;

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
            car={car}
            variant="default"
          />
        ))}
      </div>
    </div>
  );
};

export default ListingGrid;