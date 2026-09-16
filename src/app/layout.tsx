import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Ecommerce - Modern Online Store",
    template: "%s | Ecommerce",
  },
  description: "Modern e-commerce platform built with Next.js 14",
  keywords: ["ecommerce", "online store", "shopping", "products"],
  authors: [{ name: "Ecommerce Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ecommerce",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}