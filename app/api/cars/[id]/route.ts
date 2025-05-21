import { NextResponse } from 'next/server';

const cars = [
  { id: '1', name: 'Toyota Camry', type: 'Sedan', year: 2022, price: 25000, rentalPricePerDay: 70, imageUrl: 'https://via.placeholder.com/300x200.png?text=Camry', description: 'A reliable family sedan.', specs: ['Automatic', 'Petrol', '5 Seater'], availability: { forSale: true, forRent: true }, images: ['https://via.placeholder.com/600x400.png?text=Camry+Front', 'https://via.placeholder.com/600x400.png?text=Camry+Side'] },
  { id: '2', name: 'Honda Civic', type: 'Hatchback', year: 2021, price: 22000, rentalPricePerDay: 60, imageUrl: 'https://via.placeholder.com/300x200.png?text=Civic', description: 'Sporty and economical hatchback.', specs: ['Manual', 'Petrol', '5 Seater'], availability: { forSale: true, forRent: true }, images: ['https://via.placeholder.com/600x400.png?text=Civic+Front'] },
  { id: '3', name: 'Ford Explorer', type: 'SUV', year: 2023, price: 45000, rentalPricePerDay: 120, imageUrl: 'https://via.placeholder.com/300x200.png?text=Explorer', description: 'Large SUV for the whole family.', specs: ['Automatic', 'Diesel', '7 Seater', 'AWD'], availability: { forSale: true, forRent: false }, images: [] },
  { id: '4', name: 'BMW M3', type: 'Sports', year: 2022, price: 75000, rentalPricePerDay: 250, imageUrl: 'https://via.placeholder.com/300x200.png?text=M3', description: 'High-performance sports car.', specs: ['Automatic', 'Petrol', '4 Seater', 'Performance'], availability: { forSale: false, forRent: true }, images: [] },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const carId = (await params).id;
  const car = cars.find(c => c.id === carId);

  if (car) {
    return NextResponse.json(car);
  } else {
    return NextResponse.json({ message: 'Car not found' }, { status: 404 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: `Car ${params.id} updated successfully (placeholder)` });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: `Car ${params.id} deleted successfully (placeholder)` });
}