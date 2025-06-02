-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH', 'DIGITAL_WALLET');

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('PURCHASE', 'TRADE_IN', 'FINANCING', 'TEST_DRIVE');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'IN_PROGRESS', 'CONVERTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "LoyaltyTransactionType" AS ENUM ('EARNED', 'REDEEMED', 'EXPIRED', 'BONUS');

-- AlterTable User - Add new fields
ALTER TABLE "User" ADD COLUMN "phone" TEXT;
ALTER TABLE "User" ADD COLUMN "address" TEXT;
ALTER TABLE "User" ADD COLUMN "driverLicense" TEXT;
ALTER TABLE "User" ADD COLUMN "loyaltyPoints" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "membershipTier" "MembershipTier" NOT NULL DEFAULT 'BRONZE';

-- AlterTable Car - Modify and add fields
ALTER TABLE "Car" ALTER COLUMN "costPerDay" TYPE DECIMAL(10,2);
ALTER TABLE "Car" ALTER COLUMN "costIfExtend" TYPE DECIMAL(10,2);
ALTER TABLE "Car" ADD COLUMN "brand" TEXT;
ALTER TABLE "Car" ADD COLUMN "model" TEXT;
ALTER TABLE "Car" ADD COLUMN "salePrice" DECIMAL(10,2);
ALTER TABLE "Car" ADD COLUMN "mileage" INTEGER;
ALTER TABLE "Car" ADD COLUMN "licensePlate" TEXT;
ALTER TABLE "Car" ADD COLUMN "rentalStatus" "RentalStatus" NOT NULL DEFAULT 'AVAILABLE';
ALTER TABLE "Car" ALTER COLUMN "price" TYPE DECIMAL(10,2);

-- Rename tables to follow naming convention
ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "Car" RENAME TO "cars";

-- CreateTable RentalBooking
CREATE TABLE "rental_bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "pickupLocation" TEXT,
    "dropoffLocation" TEXT,
    "totalCost" DECIMAL(10,2) NOT NULL,
    "drivingDistance" INTEGER,
    "distanceExchange" DECIMAL(10,2),
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "specialRequests" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable SalesInquiry
CREATE TABLE "sales_inquiries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "inquiryType" "InquiryType" NOT NULL DEFAULT 'PURCHASE',
    "message" TEXT,
    "contactPreference" TEXT,
    "phoneNumber" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "followUpDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable LoyaltyPointTransaction
CREATE TABLE "loyalty_point_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "transactionType" "LoyaltyTransactionType" NOT NULL,
    "description" TEXT NOT NULL,
    "relatedBookingId" TEXT,
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_point_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable Payment
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "paymentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable Review
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable MaintenanceRecord
CREATE TABLE "maintenance_records" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "maintenanceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(10,2),
    "performedBy" TEXT,
    "maintenanceDate" TIMESTAMP(3) NOT NULL,
    "nextDueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_bookingId_key" ON "payments"("bookingId");

-- AddForeignKey
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_inquiries" ADD CONSTRAINT "sales_inquiries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_inquiries" ADD CONSTRAINT "sales_inquiries_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_point_transactions" ADD CONSTRAINT "loyalty_point_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "rental_bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create indexes for better performance
CREATE INDEX "rental_bookings_userId_idx" ON "rental_bookings"("userId");
CREATE INDEX "rental_bookings_carId_idx" ON "rental_bookings"("carId");
CREATE INDEX "rental_bookings_startDate_idx" ON "rental_bookings"("startDate");
CREATE INDEX "rental_bookings_status_idx" ON "rental_bookings"("status");

CREATE INDEX "sales_inquiries_userId_idx" ON "sales_inquiries"("userId");
CREATE INDEX "sales_inquiries_carId_idx" ON "sales_inquiries"("carId");
CREATE INDEX "sales_inquiries_status_idx" ON "sales_inquiries"("status");

CREATE INDEX "loyalty_point_transactions_userId_idx" ON "loyalty_point_transactions"("userId");
CREATE INDEX "loyalty_point_transactions_createdAt_idx" ON "loyalty_point_transactions"("createdAt");

CREATE INDEX "reviews_carId_idx" ON "reviews"("carId");
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

CREATE INDEX "maintenance_records_carId_idx" ON "maintenance_records"("carId");
CREATE INDEX "maintenance_records_maintenanceDate_idx" ON "maintenance_records"("maintenanceDate");

CREATE INDEX "cars_availabilityForRent_idx" ON "cars"("availabilityForRent");
CREATE INDEX "cars_availabilityForSale_idx" ON "cars"("availabilityForSale");
CREATE INDEX "cars_rentalStatus_idx" ON "cars"("rentalStatus");
CREATE INDEX "cars_normalizedCategory_idx" ON "cars"("normalizedCategory");
CREATE INDEX "cars_brand_idx" ON "cars"("brand");

CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_membershipTier_idx" ON "users"("membershipTier");