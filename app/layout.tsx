import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import StoreLayout from "@/components/StoreLayout";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mulberries.shop"),
  title: {
    default: "Mulberries | Premium Products",
    template: "%s | Mulberries",
  },
  description:
    "Discover premium products thoughtfully selected for modern living.",
  keywords: [
    "Mulberries",
    "premium products",
    "online shopping",
    "sarees",
    "silk sarees",
    "Kanjivaram sarees",
  ],
  authors: [{ name: "Mulberries" }],
  creator: "Mulberries",
  openGraph: {
    title: "Mulberries | Premium Products",
    description:
      "Discover premium products thoughtfully selected for modern living.",
    url: "https://mulberries.shop",
    siteName: "Mulberries",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mulberries | Premium Products",
    description:
      "Discover premium products thoughtfully selected for modern living.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <CartProvider>
          <StoreLayout>{children}</StoreLayout>
        </CartProvider>
      </body>
    </html>
  );
}