import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Outfit, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL('https://ihate-pdf.vercel.app/'),
  verification: {
    google: 'google6bce0a8e0e54fdd9',
  },
  title: {
    default: "i hate pdf | The Hostile Productivity Suite",
    template: "%s | i hate pdf"
  },
  description: "When you really hate PDFs. Free client-side tools to corrupt, ruin, inflate, and explode your PDF files. 100% in-browser, completely undetectable.",
  keywords: ["i hate pdf", "ihatepdf", "corrupt pdf", "ruin pdf", "break pdf", "pdf corruptor", "fake corrupted file", "how to break a pdf"],
  authors: [{ name: "ihatepdf" }],
  creator: "ihatepdf",
  openGraph: {
    title: "i hate pdf | The Hostile Productivity Suite",
    description: "Client-side document destruction. No uploads. No servers. No survivors. Perfect for college deadlines and corporate reports.",
    url: "https://ihate-pdf.vercel.app/",
    siteName: "ihatepdf",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "i hate pdf | The Hostile Productivity Suite",
    description: "When you really hate PDFs. Free client-side tools to corrupt, ruin, and explode your PDF files.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://ihate-pdf.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${instrumentSerif.variable}`}
    >
      <body className="flex flex-col min-h-screen">
        <JsonLd />
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
