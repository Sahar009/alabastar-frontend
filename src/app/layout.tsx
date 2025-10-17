import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AppToaster from "../components/Toaster";
import ProfileCompletionWrapper from "../components/ProfileCompletionWrapper";
import { AuthProvider } from "../contexts/AuthContext";
import { ReduxProvider } from "../store/Provider";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alabastar — Trusted home & business services",
    template: "%s | Alabastar"
  },
  description: "Book verified providers for plumbing, electrical, cleaning, moving and more. Escrow-backed payments, reviews, and 24/7 support.",
  keywords: [
    "home services",
    "plumber",
    "electrician",
    "cleaning",
    "moving",
    "handyman",
    "on-demand services",
    "Nigeria services marketplace",
    "escrow payments"
  ],
  applicationName: "Alabastar",
  authors: [{ name: "Alabastar" }],
  creator: "Alabastar",
  publisher: "Alabastar",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Alabastar",
    title: "Alabastar — Trusted home & business services",
    description: "Book verified providers near you. Safe escrow payments and top-rated pros.",
    images: [
      {
        url: "/brand/logo-horizontal.svg",
        width: 1200,
        height: 630,
        alt: "Alabastar"
      }
    ],
    locale: "en_NG"
  },
  twitter: {
    card: "summary_large_image",
    site: "@alabastar",
    creator: "@alabastar",
    title: "Alabastar — Trusted home & business services",
    description: "Book verified providers near you. Safe escrow payments and top-rated pros.",
    images: ["/brand/logo-horizontal.svg"]
  },
  category: "Home Services"
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ReduxProvider>
          <AuthProvider>
            <Navbar />
            <AppToaster />
            <ProfileCompletionWrapper />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
