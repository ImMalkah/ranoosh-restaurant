import type { Metadata } from "next";
import { Outfit, Cinzel } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ranoosh-restaurant.vercel.app"),
  title: {
    default: "Ranoosh Restaurant & Lounge",
    template: "%s | Ranoosh"
  },
  description: "Experience premium Middle Eastern dining and a luxurious lounge atmosphere at Ranoosh.",
  keywords: ["Middle Eastern Restaurant", "High-End Dining", "Lounge", "Mezze", "Shisha", "Lebanese Cuisine"],
  openGraph: {
    title: "Ranoosh Restaurant & Lounge",
    description: "Experience premium Middle Eastern dining and a luxurious lounge atmosphere at Ranoosh.",
    url: "https://ranoosh-restaurant.vercel.app",
    siteName: "Ranoosh Restaurant",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${cinzel.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
