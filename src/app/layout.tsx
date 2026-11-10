import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { DemoStoreProvider } from "@/components/providers/DemoStoreProvider";
import { Toaster } from "@/components/ui/Toaster";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BASAVA — Handcrafted Luxury Leather & Bespoke Atelier",
    template: "%s | BASAVA",
  },
  description:
    "Rooted in craft. Made for living. Discover thoughtfully designed genuine leather essentials and create something uniquely yours with BASAVA.",
  icons: {
    icon: "/images/basava-favicon.png",
    apple: "/images/basava-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal">
        <ScrollProgress />
        <DemoStoreProvider>
          {children}
          <Toaster />
        </DemoStoreProvider>
      </body>
    </html>
  );
}
