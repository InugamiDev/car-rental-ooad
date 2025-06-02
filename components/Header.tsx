'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/cars', label: 'Find a Car' },
    { href: '/rewards', label: 'Driving Rewards' },
    { href: '/account', label: 'My Account' },
    { href: '/faq', label: 'Help (FAQ)' },
  ];

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
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 ml-4 pl-4 border-l border-border">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                EN
              </button>
              <span className="text-muted-foreground/50">|</span>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                VI
              </button>
            </div>
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