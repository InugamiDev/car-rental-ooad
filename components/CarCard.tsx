import Image from 'next/image';

interface CarCardProps {
  imageUrl: string;
  title: string;
  price: string;
  specs: { icon?: any; label: string }[];
  isRental?: boolean;
}

const CarCard: React.FC<CarCardProps> = ({ imageUrl, title, price, specs, isRental }) => {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="relative w-full h-48">
        <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" className="rounded-t-md" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-xl font-bold text-[#0057D9] mb-2">{price}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {specs.map((spec, index) => (
            <span key={index} className="text-xs text-[#6C757D] bg-gray-100 px-2 py-1 rounded-sm flex items-center">
              {spec.label}
            </span>
          ))}
        </div>
        <button className={`w-full py-2 px-4 rounded-md font-semibold text-white ${isRental ? 'bg-green-500 hover:bg-green-600' : 'bg-[#FF8C00] hover:bg-[#E67E00]'}`}>
          {isRental ? 'Rent Now' : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default CarCard;