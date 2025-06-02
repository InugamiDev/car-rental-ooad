import { NextRequest } from 'next/server';
import { GET, POST } from '../cars/route';

// Mock the file system module
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(() => '/mock/path/rental.json'),
}));

const mockRentalData = [
  {
    name: 'Toyota Camry 2024',
    price: '1,500,000 VND/ngày',
    numberOfSeat: '5 chỗ',
    gearBox: 'Tự động',
    version: '2024',
    plate: '30A-12345',
    'image-src': 'https://example.com/camry.jpg',
    'web-scraper-start-url': 'https://example.com',
    scrapedCarType: 'Sedan'
  },
  {
    name: 'Honda Civic 2023',
    price: '1,200,000 VND/ngày',
    numberOfSeat: '5 chỗ',
    gearBox: 'Số sàn',
    version: '2023',
    plate: '30B-67890',
    'image-src': 'https://example.com/civic.jpg',
    'web-scraper-start-url': 'https://example.com',
    scrapedCarType: 'Hatchback'
  }
];

describe('/api/cars', () => {
  beforeEach(() => {
    const fs = require('fs');
    fs.readFileSync.mockReturnValue(JSON.stringify(mockRentalData));
  });

  describe('GET /api/cars', () => {
    it('should return transformed car data with pagination', async () => {
      const request = new NextRequest('http://localhost:3000/api/cars');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('cars');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.cars)).toBe(true);
      expect(data.cars.length).toBe(2);
      
      // Check if data is transformed correctly
      const firstCar = data.cars[0];
      expect(firstCar).toHaveProperty('id');
      expect(firstCar).toHaveProperty('name');
      expect(firstCar).toHaveProperty('costPerDay');
      expect(firstCar).toHaveProperty('normalizedCategory');
      expect(firstCar.name).toBe('Toyota Camry 2024');
      expect(firstCar.normalizedCategory).toBe('SEDAN');
    });

    it('should handle pagination parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/cars?page=1&limit=1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cars.length).toBe(1);
      expect(data.pagination.currentPage).toBe(1);
      expect(data.pagination.limit).toBe(1);
      expect(data.pagination.totalItems).toBe(2);
      expect(data.pagination.totalPages).toBe(2);
    });

    it('should handle search parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/cars?search=toyota');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cars.length).toBe(1);
      expect(data.cars[0].name.toLowerCase()).toContain('toyota');
    });

    it('should handle category filter', async () => {
      const request = new NextRequest('http://localhost:3000/api/cars?category=sedan');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cars.length).toBe(1);
      expect(data.cars[0].normalizedCategory).toBe('SEDAN');
    });

    it('should handle price range filter', async () => {
      const request = new NextRequest('http://localhost:3000/api/cars?minPrice=50&maxPrice=100');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.cars)).toBe(true);
      // All returned cars should be within price range
      data.cars.forEach((car: any) => {
        expect(car.costPerDay).toBeGreaterThanOrEqual(50);
        expect(car.costPerDay).toBeLessThanOrEqual(100);
      });
    });

    it('should handle file read errors gracefully', async () => {
      const fs = require('fs');
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      const request = new NextRequest('http://localhost:3000/api/cars');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cars).toEqual([]);
      expect(data.pagination.totalItems).toBe(0);
    });
  });

  describe('POST /api/cars', () => {
    it('should return method not allowed for POST requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Car',
          brand: 'Toyota',
          costPerDay: 100
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(501);
      expect(data.error.code).toBe('NOT_IMPLEMENTED');
    });
  });
});

describe('Data transformation functions', () => {
  it('should correctly parse Vietnamese prices', () => {
    // This tests the price parsing logic within the transformation
    const testCases = [
      { input: '1,500,000 VND/ngày', expectedMin: 25, expectedMax: 500 },
      { input: '500,000 VND/giờ', expectedMin: 25, expectedMax: 500 },
      { input: 'invalid price', expectedDefault: 50 }
    ];

    // Since the transformation logic is internal, we test through the API
    testCases.forEach(async (testCase) => {
      const mockData = [{
        name: 'Test Car',
        price: testCase.input,
        numberOfSeat: '5 chỗ',
        gearBox: 'Tự động',
        version: '2024',
        plate: '30A-12345'
      }];

      const fs = require('fs');
      fs.readFileSync.mockReturnValue(JSON.stringify(mockData));

      const request = new NextRequest('http://localhost:3000/api/cars');
      const response = await GET(request);
      const data = await response.json();

      if (testCase.expectedDefault) {
        expect(data.cars[0].costPerDay).toBe(testCase.expectedDefault);
      } else {
        expect(data.cars[0].costPerDay).toBeGreaterThanOrEqual(testCase.expectedMin);
        expect(data.cars[0].costPerDay).toBeLessThanOrEqual(testCase.expectedMax);
      }
    });
  });

  it('should correctly normalize car categories', () => {
    const testCases = [
      { name: 'Toyota Camry Sedan', expected: 'SEDAN' },
      { name: 'Honda CR-V SUV', expected: 'SUV' },
      { name: 'Toyota Avanza Van', expected: 'VAN' },
      { name: 'Ford Ranger Truck', expected: 'TRUCK' },
      { name: 'BMW X5 Luxury', expected: 'LUXURY' },
      { name: 'Unknown Vehicle', expected: 'SEDAN' } // default
    ];

    testCases.forEach(async (testCase) => {
      const mockData = [{
        name: testCase.name,
        price: '1,000,000 VND/ngày',
        numberOfSeat: '5 chỗ',
        gearBox: 'Tự động',
        version: '2024',
        plate: '30A-12345'
      }];

      const fs = require('fs');
      fs.readFileSync.mockReturnValue(JSON.stringify(mockData));

      const request = new NextRequest('http://localhost:3000/api/cars');
      const response = await GET(request);
      const data = await response.json();

      expect(data.cars[0].normalizedCategory).toBe(testCase.expected);
    });
  });
});