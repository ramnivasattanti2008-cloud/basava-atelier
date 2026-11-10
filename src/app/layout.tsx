import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { DemoStoreProvider } from "@/components/providers/DemoStoreProvider";
import { Toaster } from "@/components/ui/Toaster";
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
  title: "Kris Designs — Leather Bags & Bespoke Work",
  description: "Bespoke leather bags and accessories, hand-crafted in Bengaluru. Catalogue from Basava.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal">
        <DemoStoreProvider>
          {children}
          <Toaster />
        </DemoStoreProvider>
      </body>
    </html>
  );
}
