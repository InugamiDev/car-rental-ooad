-- Add loyalty points to rental bookings
ALTER TABLE "rental_bookings" ADD COLUMN "loyaltyPoints" INTEGER DEFAULT 0;