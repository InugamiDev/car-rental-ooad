import Image from 'next/image';

const sampleCarDetail = {
  id: '1',
  name: 'Reliable Sedan Deluxe',
  images: [
    'https://via.placeholder.com/600x400.png?text=Sedan+Front',
    'https://via.placeholder.com/600x400.png?text=Sedan+Side',
    'https://via.placeholder.com/600x400.png?text=Sedan+Interior',
    'https://via.placeholder.com/600x400.png?text=Sedan+Back',
  ],
  price: '$25,000 or $70/day',
  description: 'A very reliable and comfortable sedan, perfect for city driving and long trips. Low mileage and well-maintained. Available for both sale and rental.',
  specs: [
    { label: 'Type', value: 'Sedan' },
    { label: 'Transmission', value: 'Automatic' },
    { label: 'Engine', value: '2.0L Petrol' },
    { label: 'Mileage', value: '30,000 miles' },
    { label: 'Color', value: 'Silver' },
    { label: 'Seats', value: '5' },
    { label: 'Fuel Efficiency', value: '25 MPG city / 35 MPG hwy' },
  ],
  isRental: true,
};


export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const car = sampleCarDetail;

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden shadow-lg">
            <Image src={car.images[0]} alt={car.name} layout="fill" objectFit="cover" />
          </div>
          <div className="flex overflow-x-scroll space-x-2 p-2 bg-gray-100 rounded-md">
            {car.images.map((img, index) => (
              <div key={index} className="relative w-24 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#0057D9]">
                <Image src={img} alt={`${car.name} thumbnail ${index + 1}`} layout="fill" objectFit="cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2 text-[#212529]">{car.name}</h1>
          <p className="text-2xl font-semibold text-[#0057D9] mb-4">{car.price}</p>
          <p className="text-gray-700 mb-6">{car.description}</p>

          <h2 className="text-xl font-semibold mb-3 text-[#212529]">Specifications</h2>
          <ul className="list-disc list-inside space-y-1 mb-6 text-[#212529]">
            {car.specs.map((spec, index) => (
              <li key={index}><span className="font-medium">{spec.label}:</span> {spec.value}</li>
            ))}
          </ul>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {car.isRental ? 'Book This Car' : 'Purchase This Car'}
            </h2>
            {car.isRental && (
              <div className="mb-4">
                <label htmlFor="booking-date" className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <input type="date" id="booking-date" name="booking-date" className="w-full p-2 border rounded-md" />
              </div>
            )}
            <button className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white font-bold py-3 px-4 rounded-md text-lg">
              {car.isRental ? 'Book Now' : 'Inquire to Buy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}