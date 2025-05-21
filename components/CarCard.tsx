import Image from 'next/image';
import Link from 'next/link';

interface CarCardProps {
  id: string;
  imageUrl: string;
  name: string;
  pricePerDay: string;
  specs: { label: string }[]; // Removed icon property
  pointsPerDay: string;
}

const CarCard: React.FC<CarCardProps> = ({ id, imageUrl, name, pricePerDay, specs, pointsPerDay }) => {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden flex flex-col bg-white">
      <div className="relative w-full h-48">
        <Image src={imageUrl} alt={name} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{name}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {specs.map((spec, index) => (
            <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full flex items-center">
              {/* spec.icon && <spec.icon className="w-3 h-3 mr-1" /> */}
              {spec.label}
            </span>
          ))}
        </div>
        <p className="text-lg font-bold text-blue-600 mb-1">{pricePerDay}/day</p>
        <p className="text-sm font-semibold text-orange-500 mb-4">
          Earn {pointsPerDay} Points/Day!
        </p>
        <div className="mt-auto">
          <Link href={`/cars/${id}`} legacyBehavior>
            <a className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out">
              View & Book
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;