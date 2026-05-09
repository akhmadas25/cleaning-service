import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CleanPro — Professional Cleaning Services",
  description:
    "Book trusted, professional cleaning services for your home or office. Fast, reliable, and affordable cleaning tailored to your needs.",
  keywords: ["cleaning service", "home cleaning", "office cleaning", "professional cleaners"],
  openGraph: {
    title: "CleanPro — Professional Cleaning Services",
    description: "Book trusted, professional cleaning services for your home or office.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans antialiased bg-white text-slate-900">
        <SessionProvider>
          {children}
          <Toaster position="top-center" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
