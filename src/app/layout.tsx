import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PropertyLead Pro - Real Estate Lead Management",
  description: "Professional buyer lead management system for real estate agents. Track, manage, and convert property leads with advanced filtering, budget tracking, and timeline management.",
  keywords: "real estate, lead management, property leads, buyer leads, CRM, real estate software",
  authors: [{ name: "PropertyLead Pro Team" }],
  creator: "PropertyLead Pro",
  publisher: "PropertyLead Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PropertyLead Pro - Real Estate Lead Management",
    description: "Professional buyer lead management system for real estate agents",
    url: "https://buyerleads-production.up.railway.app",
    siteName: "PropertyLead Pro",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropertyLead Pro - Real Estate Lead Management",
    description: "Professional buyer lead management system for real estate agents",
    creator: "@propertyleadpro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
