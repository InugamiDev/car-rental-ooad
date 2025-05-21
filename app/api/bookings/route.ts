import { NextResponse } from 'next/server';

const bookings = [
  { id: 'B001', carId: '1', userId: 'U001', startDate: '2024-06-10', endDate: '2024-06-12', totalPrice: 140, status: 'Confirmed' },
  { id: 'B002', carId: '4', userId: 'U002', startDate: '2024-06-15', endDate: '2024-06-17', totalPrice: 500, status: 'Pending' },
];

export async function GET() { // Removed unused 'request'
  return NextResponse.json(bookings);
}

export async function POST(request: Request) { // 'request' is used here
  try {
    const newBookingData = await request.json();
    if (!newBookingData.carId || !newBookingData.userId || !newBookingData.startDate || !newBookingData.endDate || !newBookingData.totalPrice) {
      return NextResponse.json({ message: 'Missing required booking fields' }, { status: 400 });
    }
    
    const newBooking = {
      id: `B${String(bookings.length + 1).padStart(3, '0')}`,
      ...newBookingData,
      status: 'Pending',
    };
    bookings.push(newBooking);
    return NextResponse.json({ message: 'Booking created successfully', booking: newBooking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ message: 'Error creating booking' }, { status: 500 });
  }
}