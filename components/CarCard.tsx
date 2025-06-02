import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Card, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { Star, Users, Fuel, Settings } from 'lucide-react';

interface CarCardProps {
  car: {
    id: string;
    name: string;
    brand: string;
    model: string;
    costPerDay: number;
    normalizedCategory: string;
    passengerCapacity: number;
    transmission: string;
    fuelType: string;
    images: string[];
    specs: string[];
    availabilityForRent: boolean;
    availabilityForSale: boolean;
    salePrice?: number;
    averageRating?: number;
    totalReviews?: number;
    rentalStatus: string;
  };
  variant?: 'default' | 'compact' | 'featured';
  showSalePrice?: boolean;
  onBookNow?: (carId: string) => void;
  onViewDetails?: (carId: string) => void;
}

const CarCard: React.FC<CarCardProps> = ({
  car,
  variant = 'default',
  showSalePrice = false,
  onBookNow,
  onViewDetails
}) => {
  const isAvailable = car.availabilityForRent && car.rentalStatus === 'AVAILABLE';
  const primaryImage = car.images && car.images.length > 0 ? car.images[0] : '/placeholder-car.jpg';

  const cardClasses = clsx(
    'group overflow-hidden',
    variant === 'featured' && 'ring-2 ring-primary/20',
    !isAvailable && 'opacity-75'
  );

  const imageHeight = {
    default: 'h-48',
    compact: 'h-40',
    featured: 'h-56'
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookNow && isAvailable) {
      onBookNow(car.id);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(car.id);
    }
  };

  return (
    <Card 
      className={cardClasses}
      padding="none"
      hover={true}
      interactive={true}
    >
      <Link href={`/cars/${car.id}`} onClick={handleViewDetails}>
        {/* Car Image */}
        <div className={clsx('relative overflow-hidden', imageHeight[variant])}>
          <Image
            src={primaryImage}
            alt={car.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Availability Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant={isAvailable ? 'success' : 'warning'}
              size="sm"
            >
              {isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </div>

          {/* Featured Badge */}
          {variant === 'featured' && (
            <div className="absolute top-3 right-3">
              <Badge variant="default" size="sm">
                Featured
              </Badge>
            </div>
          )}

          {/* Rating */}
          {car.averageRating && car.totalReviews && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-white text-xs font-medium">
                  {car.averageRating}
                </span>
                <span className="text-white/80 text-xs">
                  ({car.totalReviews})
                </span>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Car Details */}
          <div className="space-y-3">
            {/* Title and Category */}
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {car.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {car.brand} • {car.normalizedCategory}
              </p>
            </div>

            {/* Specifications */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-xs">{car.passengerCapacity}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Settings className="w-4 h-4" />
                <span className="text-xs">{car.transmission}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Fuel className="w-4 h-4" />
                <span className="text-xs">{car.fuelType}</span>
              </div>
            </div>

            {/* Additional Specs (compact layout) */}
            {variant !== 'compact' && car.specs && car.specs.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {car.specs.slice(0, 3).map((spec, index) => (
                  <Badge
                    key={index}
                    variant="neutral"
                    size="sm"
                  >
                    {spec}
                  </Badge>
                ))}
                {car.specs.length > 3 && (
                  <Badge variant="neutral" size="sm">
                    +{car.specs.length - 3} more
                  </Badge>
                )}
              </div>
            )}

          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-3">
          {/* Pricing Row - Enhanced */}
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl lg:text-2xl font-bold text-foreground">
                  ${car.costPerDay}
                </span>
                <span className="text-sm text-muted-foreground">/day</span>
              </div>
              {showSalePrice && car.availabilityForSale && car.salePrice && (
                <div className="text-sm text-success font-medium">
                  Sale: ${car.salePrice.toLocaleString()}
                </div>
              )}
            </div>
            {car.averageRating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-foreground">
                  {car.averageRating}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons - Improved Layout */}
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10 text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleViewDetails();
              }}
            >
              View Details
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              className="flex-1 h-10 text-sm font-medium"
              disabled={!isAvailable}
              onClick={handleBookNow}
            >
              {isAvailable ? 'Book Now' : 'Unavailable'}
            </Button>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default CarCard;