import { NextResponse } from 'next/server';

const cars = [
  { id: '1', name: 'Toyota Camry', type: 'Sedan', year: 2022, price: 25000, rentalPricePerDay: 70, imageUrl: 'https://via.placeholder.com/300x200.png?text=Camry', specs: ['Automatic', 'Petrol', '5 Seater'], availability: { forSale: true, forRent: true } },
  { id: '2', name: 'Honda Civic', type: 'Hatchback', year: 2021, price: 22000, rentalPricePerDay: 60, imageUrl: 'https://via.placeholder.com/300x200.png?text=Civic', specs: ['Manual', 'Petrol', '5 Seater'], availability: { forSale: true, forRent: true } },
  { id: '3', name: 'Ford Explorer', type: 'SUV', year: 2023, price: 45000, rentalPricePerDay: 120, imageUrl: 'https://via.placeholder.com/300x200.png?text=Explorer', specs: ['Automatic', 'Diesel', '7 Seater', 'AWD'], availability: { forSale: true, forRent: false } },
  { id: '4', name: 'BMW M3', type: 'Sports', year: 2022, price: 75000, rentalPricePerDay: 250, imageUrl: 'https://via.placeholder.com/300x200.png?text=M3', specs: ['Automatic', 'Petrol', '4 Seater', 'Performance'], availability: { forSale: false, forRent: true } },
];

export async function GET(request: Request) {
  return NextResponse.json(cars);
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'Car created successfully (placeholder)' }, { status: 201 });
}