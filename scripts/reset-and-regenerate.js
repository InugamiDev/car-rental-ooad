#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('🔄 Resetting and regenerating database...\n');

try {
  // Generate Prisma Client with new schema
  console.log('1. Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Run migrations
  console.log('\n2. Running migrations...');
  execSync('npx prisma migrate reset --force', { stdio: 'inherit' });

  // Seed the database
  console.log('\n3. Seeding database...');
  execSync('npx tsx scripts/seed-database.ts', { stdio: 'inherit' });

  console.log('\n✅ Database reset and regenerated successfully!');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}