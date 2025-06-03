import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthSessionProvider from '@/components/AuthSessionProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vietnam Wheels - Premium Car Rental Services",
  description: "Premium car rental services in Vietnam. Choose from our wide selection of vehicles with transparent pricing, 24/7 support, and exceptional customer service.",
  keywords: "car rental, Vietnam, premium vehicles, car hire, transportation",
  openGraph: {
    title: "Vietnam Wheels - Premium Car Rental Services",
    description: "Premium car rental services in Vietnam with transparent pricing and excellent service.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          async
          type="text/javascript"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
