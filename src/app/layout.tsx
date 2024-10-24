import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata configuration for SEO and social sharing
export const metadata: Metadata = {
  title: "Diwali Fortune Wheel",
  description: "Created by Savart",
  openGraph: {
    title: "Diwali Fortune Wheel",
    description: "Created by Savart",
    url: "https://diwali-spin-wheel.vercel.app/", // Replace with the actual URL
    siteName: "Savart",
    images: [
      {
        url: "https://in.pinterest.com/pin/448178600433233392/", // Replace with the actual image URL
        width: 800,
        height: 600,
        alt: "Diwali Fortune Wheel",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diwali Fortune Wheel",
    description: "Created by Savart",
    images: ["https://in.pinterest.com/pin/448178600433233392/"], // Replace with the actual image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        {/* Add any other custom meta tags here */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
