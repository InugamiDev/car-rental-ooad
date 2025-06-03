'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Button from '@/components/ui/Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  // Base navigation links
  const baseNavLinks = [
    { href: '/cars', label: 'Find a Car' },
    { href: '/rewards', label: 'Driving Rewards' },
  ];

  // Authenticated user links
  const authNavLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/account', label: 'My Account' },
  ];

  // Guest user links
  const guestNavLinks = [
    { href: '/auth/login', label: 'Sign In' },
    { href: '/auth/register', label: 'Sign Up' },
  ];

  // Help link (always visible)
  const helpLink = { href: '/faq', label: 'Help (FAQ)' };

  // Combine navigation links based on authentication status
  const navLinks = [
    ...baseNavLinks,
    ...(session ? authNavLinks : guestNavLinks),
    helpLink,
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-border">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl lg:text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Vietnam Wheels
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Desktop Logout Button for Authenticated Users */}
            {session && (
              <div className="flex items-center ml-2 pl-2 border-l border-border">
                <span className="text-sm text-muted-foreground mr-3">
                  <User className="w-4 h-4 inline mr-1" />
                  {session.user?.name || session.user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-white">
            <nav className="py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile User Info and Logout for Authenticated Users */}
              {session && (
                <div className="border-t border-border mt-4 pt-4">
                  <div className="px-4 py-2">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <User className="w-4 h-4 mr-2" />
                      <span>Signed in as</span>
                    </div>
                    <div className="font-medium text-foreground mb-3">
                      {session.user?.name || session.user?.email}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full justify-center"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border mt-4 pt-4">
                <span className="text-sm font-medium text-muted-foreground">Language</span>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors">
                    EN
                  </button>
                  <span className="text-muted-foreground/50">|</span>
                  <button className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors">
                    VI
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;