# PROJECT_CONTEXT.md — Kris Designs / Basava

## Mission & Purpose
Build a luxury, bespoke leather goods e-commerce experience and operational studio portal for **Kris Designs** (independent leather artisan workshop in Bengaluru) featuring the 40-product catalogue curated under **Basava**.

## Core Brand & Business Facts
- **Maker**: Kris Designs (`@kris_designs1` on Instagram) — Bespoke leather bags, sleeves, wallets, hand-crafted in Bengaluru.
- **Retail Storefront**: Basava (`basava.store.link`, `@basava_social`) — 40 genuine leather pieces across 7 categories.
- **Relationship Principle**: Transparent, non-conflated attribution. The connection between the two labels is documented as provisional and subject to owner confirmation.
- **Catalogue**: Exactly 40 products, ₹1,000 to ₹6,000, 39 in stock, 1 out of stock. High-resolution studio photography served from CDN with multiply blending over warm linen cards.
- **Customization**: Bespoke custom studio with live debossed monogram visualizer (blind deboss / gold foil), custom dimensioning, and direct WhatsApp pre-filled inquiry generation.
- **Support & Policies**: 7–10 days delivery time, order tracking by reference ID (e.g. `KD-10001`), customer care via WhatsApp.

## Technical Stack
- **Framework**: Next.js 16.4.6 (App Router, Turbopack, Cache Components, Partial Prefetching)
- **UI & Styling**: Tailwind CSS v4, Motion (formerly Framer Motion) v14, Lucide React icons
- **State & Local Persistence**: Zustand v5 with localStorage persistence, synchronized across browser tabs
- **Fonts**: Cormorant Garamond (display serif) + Manrope (sans-serif)
- **Admin Security**: Server-side passcode gate (`ADMIN_PASSCODE` in `.env.local`, signed session cookies)
