import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://royalmechanic.in";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Royal Mechanic | Doorstep Bike Service in Bengaluru",
    template: "%s | Royal Mechanic",
  },
  description:
    "Royal Mechanic offers doorstep bike service in Bengaluru. Book bike maintenance, repair, and service packages online with transparent pricing.",
  keywords: [
    "Royal Mechanic",
    "bike service Bengaluru",
    "doorstep bike service",
    "bike repair at home",
    "motorcycle service Bengaluru",
    "two wheeler service near me",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Royal Mechanic | Doorstep Bike Service in Bengaluru",
    description:
      "Book doorstep bike service in Bengaluru with Royal Mechanic. Fast pickup support, trusted mechanics, and clear billing.",
    siteName: "Royal Mechanic",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Royal Mechanic logo",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Mechanic | Doorstep Bike Service in Bengaluru",
    description:
      "Doorstep bike service booking platform for Bengaluru. Service packages, tracking, and transparent billing.",
    images: ["/images/logo.png"],
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
  category: "automotive",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
