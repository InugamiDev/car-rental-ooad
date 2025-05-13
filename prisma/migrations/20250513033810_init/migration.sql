-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "imageURL" TEXT,
    "name" TEXT NOT NULL,
    "costPerDay" TEXT,
    "costIfExtend" TEXT,
    "scrapedCarType" TEXT,
    "normalizedCategory" TEXT,
    "passengerCapacity" INTEGER,
    "luggageCapacity" TEXT,
    "transmission" TEXT,
    "fuelType" TEXT,
    "description" TEXT,
    "price" TEXT,
    "year" INTEGER,
    "availabilityForSale" BOOLEAN NOT NULL DEFAULT false,
    "availabilityForRent" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "specs" TEXT[],
    "sourceUrl" TEXT,
    "scrapeTimestamp" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
