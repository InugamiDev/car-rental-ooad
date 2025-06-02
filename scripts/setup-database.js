#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up the database...');

try {
  // Reset the database (if it exists)
  console.log('\n1. Resetting database...');
  execSync('npx prisma migrate reset --force', { stdio: 'inherit' });

  // Run migrations
  console.log('\n2. Running migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  // Generate Prisma Client
  console.log('\n3. Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Seed the database with real car data
  console.log('\n4. Seeding database with real car data...');
  execSync('npx tsx scripts/seed-database.ts', { stdio: 'inherit' });

  console.log('\n✅ Database setup completed successfully!');
  console.log('\nYou can now start the development server with:');
  console.log('npm run dev');

} catch (error) {
  console.error('\n❌ Error setting up database:', error.message);
  process.exit(1);
}