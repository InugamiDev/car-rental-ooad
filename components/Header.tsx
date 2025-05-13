'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#0057D9]">
          HybridWheels
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/" className="text-gray-600 hover:text-[#0057D9]">Home</Link>
          <Link href="/cars" className="text-gray-600 hover:text-[#0057D9]">Listings</Link>
          {session && (
            <Link href="/dashboard" className="text-gray-600 hover:text-[#0057D9]">Dashboard</Link>
          )}
          
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : session ? (
            <>
              <span className="text-sm text-gray-700 hidden sm:inline">Welcome, {session.user?.name || session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-[#FF8C00] hover:bg-[#E67E00] text-white px-3 py-1.5 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-[#0057D9] hover:bg-[#004ABF] text-white px-3 py-1.5 rounded-md text-sm font-medium"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;