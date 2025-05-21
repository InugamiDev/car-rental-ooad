import Image from 'next/image';
import Link from 'next/link'; // For the booking button

// Mock data for a car - in a real app, this would be fetched based on params.id
const getCarDetails = async (id: string) => {
  // Simulate API call
  console.log(`Fetching details for car ID: ${id}`); // For debugging
  return {
    id: id,
    name: 'Toyota Vios',
    imageUrl: 'https://via.placeholder.com/800x600.png?text=Toyota+Vios+Large', // Single large image
    specs: [
      { label: 'Seats', value: '5' },
      { label: 'Transmission', value: 'Automatic' },
      { label: 'Fuel', value: 'Petrol' },
      { label: 'Air Conditioning', value: 'Yes' },
      // Add more relevant specs if needed
    ],
    pricePerDay: '750,000 VND',
    description: 'A popular and reliable choice for navigating Vietnam. Comfortable, fuel-efficient, and easy to drive, making it ideal for both city trips and longer explorations.',
    // Points calculation example
    pointsPerKm: 10,
    exampleTripKm: 200,
  };
};

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const car = await getCarDetails(params.id);

  if (!car) {
    return <div className="container mx-auto p-4 text-center">Car not found.</div>;
  }

  const potentialPointsForExampleTrip = car.exampleTripKm * car.pointsPerKm;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2">
            <div className="relative w-full h-80 md:h-[500px]"> {/* Adjusted height */}
              <Image
                src={car.imageUrl}
                alt={`Image of ${car.name}`}
                layout="fill"
                objectFit="cover"
                priority // Good for LCP
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                Detailed View: {car.name}
              </h1>
              <p className="text-2xl font-semibold text-blue-600 mb-6">
                Rental Cost: {car.pricePerDay} (Mock)
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mb-2">Key Specifications:</h2>
              <ul className="list-disc list-inside space-y-1 mb-6 text-gray-600">
                {car.specs.map((spec, index) => (
                  <li key={index}>
                    <span className="font-medium">{spec.label}:</span> {spec.value}
                  </li>
                ))}
              </ul>
              
              <p className="text-gray-600 mb-6">{car.description}</p>
            </div>

            <div>
              {/* Driving Distance Rewards Highlight */}
              <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6 rounded-md">
                <h3 className="font-bold text-lg">Driving Distance Rewards!</h3>
                <p>Earn <span className="font-bold">{car.pointsPerKm} Points per KM!</span></p>
                <p>A {car.exampleTripKm}km trip in this car could earn you <span className="font-bold">{potentialPointsForExampleTrip.toLocaleString()} Points</span> towards great rewards!</p>
              </div>

              {/* Book Now Button */}
              <Link href={`/booking/checkout?carId=${car.id}`} legacyBehavior>
                <a className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center font-bold py-3 px-4 rounded-md text-lg transition duration-150 ease-in-out">
                  Book This Car & Collect Points
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}