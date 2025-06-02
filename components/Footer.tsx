import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container-responsive">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="text-xl font-bold text-primary mb-4 block">
                Vietnam Wheels
              </Link>
              <p className="text-muted-foreground mb-4 max-w-md">
                Premium car rental services with transparent pricing and exceptional customer experience.
                Your journey starts here.
              </p>
              <div className="flex space-x-4">
                <span className="text-sm text-muted-foreground">Follow us:</span>
                <div className="flex space-x-3">
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Facebook
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Instagram
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/cars" className="text-muted-foreground hover:text-primary transition-colors">
                    Browse Cars
                  </Link>
                </li>
                <li>
                  <Link href="/rewards" className="text-muted-foreground hover:text-primary transition-colors">
                    Loyalty Program
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="text-muted-foreground hover:text-primary transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <span className="text-muted-foreground">24/7 Customer Service</span>
                </li>
                <li>
                  <span className="text-muted-foreground">+84 (0) 123 456 789</span>
                </li>
                <li>
                  <span className="text-muted-foreground">support@vietnamwheels.com</span>
                </li>
                <li>
                  <span className="text-muted-foreground">Dĩ An, Bình Dương, Vietnam</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © 2025 Vietnam Wheels - Mock Presentation. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end items-center space-x-6 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;