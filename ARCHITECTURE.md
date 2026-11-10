# ARCHITECTURE.md — Kris Designs Application Architecture

## 1. Directory Structure
```
src/
├── app/
│   ├── (store)/                     # Public storefront routes
│   │   ├── layout.tsx               # Storefront shell (Announcement, Header, Footer, CartDrawer, WhatsAppButton)
│   │   ├── page.tsx                 # Editorial homepage (Hero, Categories, Featured, Custom, Craft, Education)
│   │   ├── shop/page.tsx            # 40-product catalogue with multi-filter sidebar & sorting
│   │   ├── collections/[slug]/      # Dedicated category collection views
│   │   ├── products/[slug]/         # Detailed product view with thumbnail gallery & accordions
│   │   ├── custom/page.tsx          # 5-step interactive bespoke custom orders studio
│   │   ├── about/page.tsx           # Heritage, artisan story & Basava catalogue context
│   │   ├── leather-guide/page.tsx   # Plain-English hide education & care routines
│   │   ├── contact/page.tsx         # WhatsApp direct cards, phone, email & studio message form
│   │   ├── policies/page.tsx        # Delivery, Returns, Privacy & Terms of sale
│   │   ├── track-order/page.tsx     # Live status timeline lookup by order ID
│   │   ├── cart/page.tsx            # Dedicated shopping bag page
│   │   ├── checkout/page.tsx        # 2-column checkout with address validation & demo payment
│   │   └── order-confirmation/[id]/ # Post-order celebration, details & WhatsApp confirmation
│   ├── admin/
│   │   ├── login/page.tsx           # Passcode login gate
│   │   └── (dashboard)/             # Protected admin studio portal
│   │       ├── layout.tsx           # Admin sidebar shell with session check
│   │       ├── page.tsx             # Overview: KPI tiles, 14-day sales chart, recent orders & briefs
│   │       ├── products/page.tsx    # Catalogue table, live edit drawer, add new piece
│   │       ├── inventory/page.tsx   # Fast inline stock steppers & sold-out / restock presets
│   │       ├── orders/page.tsx      # Order fulfillment log with status stepper & WhatsApp customer chat
│   │       ├── custom-requests/     # Bespoke briefs with monogram tags & artisan internal notes
│   │       └── settings/page.tsx    # Brand configuration, data reset & catalogue JSON export
│   ├── api/admin/
│   │   ├── login/route.ts           # Verifies passcode, sets httpOnly session cookie
│   │   ├── logout/route.ts          # Clears session cookie
│   │   └── check/route.ts           # Validates session status
│   ├── layout.tsx                   # Root HTML shell with Google Fonts & DemoStoreProvider
│   └── globals.css                  # Modern Heritage Luxury design tokens (Espresso, Walnut, Saddle, Sand, Ivory)
├── components/
│   ├── cart/CartDrawer.tsx          # Slide-out cart drawer with quantity steppers
│   ├── custom/EngravingPreview.tsx  # Interactive debossed / gold foil monogram visualizer
│   ├── layout/                      # Header, Footer, AnnouncementBar, WhatsAppButton
│   ├── product/                     # ProductCard, QuickViewModal
│   ├── providers/                   # DemoStoreProvider with Zustand hydration & cross-tab sync
│   └── ui/                          # Overlay modal, ProductImage, Reveal, Toaster, bits
├── data/
│   ├── brand.ts                     # Brand configuration, swappable identities, contact routing
│   ├── catalogue.ts                 # Product lookup helpers and seed metadata
│   ├── categories.ts                # The 7 core categories with singular eyebrows
│   ├── demo-seed.ts                 # Sample orders (KD-10001 to KD-10008) and sample custom briefs
│   └── products.json                # Verbatim 40-product catalogue data imported from storefront
└── lib/                             # format, hooks, store, toast, types, validation, whatsapp
```

## 2. Data Flow & State Management
- **Initial Data**: 40 products from `src/data/products.json` statically pre-rendered at build time.
- **Client State**: Zustand store with localStorage persistence (`kris-designs-demo`).
- **Synchronized Hydration**: `DemoStoreProvider` rehydrates persisted state in an effect after initial render to avoid SSR hydration mismatches, while broadcasting mutations across tabs using the browser `storage` event.
- **Admin Isolation**: Admin routes (`/admin/...`) operate under a separate layout protected by a server-side session cookie (`kd_admin_session`).
