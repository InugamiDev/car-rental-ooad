const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up database for car rental platform...');

try {
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env file not found. Creating sample .env file...');
    const sampleEnv = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/carrental"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Add your actual database URL here
# DATABASE_URL="your-actual-database-url"
`;
    fs.writeFileSync(envPath, sampleEnv);
    console.log('✅ Sample .env file created. Please update DATABASE_URL with your actual database connection string.');
    console.log('📝 You can find the sample configuration in .env file');
  }

  // Generate Prisma client
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Push database schema (for development)
  console.log('📊 Pushing database schema...');
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Database push failed. This might be because:');
    console.log('   1. Database is not running');
    console.log('   2. DATABASE_URL is not configured correctly');
    console.log('   3. Database credentials are incorrect');
    console.log('');
    console.log('Please check your database connection and try again.');
    console.log('You can manually run: npx prisma db push');
    return;
  }

  console.log('✅ Database setup completed!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('   1. Update your .env file with the correct DATABASE_URL');
  console.log('   2. Run "npm run seed" to populate the database with sample data');
  console.log('   3. Run "npm run dev" to start the development server');
  console.log('');
  console.log('🎉 Your car rental platform is ready to go!');

} catch (error) {
  console.error('❌ Error setting up database:', error.message);
  console.log('');
  console.log('🔧 Troubleshooting:');
  console.log('   1. Make sure PostgreSQL is running');
  console.log('   2. Check your DATABASE_URL in .env file');
  console.log('   3. Ensure database user has proper permissions');
  console.log('   4. Try running "npx prisma db push" manually');
}