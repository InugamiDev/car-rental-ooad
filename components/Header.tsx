'use client';

import Link from 'next/link';
// import { useSession, signIn, signOut } from 'next-auth/react'; // Removed unused imports

const Header = () => {
  // const { data: session, status } = useSession(); // Mockup, so auth state not strictly needed for display
  // const loading = status === 'loading';

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Vietnam Wheels
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/search" className="text-gray-600 hover:text-blue-600">Find a Car</Link>
          <Link href="/rewards" className="text-gray-600 hover:text-blue-600">Driving Rewards</Link>
          <Link href="/account" className="text-gray-600 hover:text-blue-600">My Account</Link>
          <Link href="/faq" className="text-gray-600 hover:text-blue-600">Help (FAQ)</Link>
          <div className="text-sm text-gray-500">EN / VI</div>
        </nav>
      </div>
    </header>
  );
};

export default Header;