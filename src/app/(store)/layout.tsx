import { Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header, HeaderFallback } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <IntroReveal />
      <Suspense fallback={null}>
        <AnnouncementBar />
      </Suspense>
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
    </div>
  );
}
