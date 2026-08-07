# MidRange — Project Context

> **Purpose:** Save this file at the start of every session. It contains everything needed to work on MidRange without re-reading the entire codebase.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.10 |
| Language | TypeScript | 5.x |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | 4.x (CSS-first config, NO tailwind.config file) |
| ORM | Prisma | 7.8.0 |
| Database | PostgreSQL (Neon) | via `@prisma/adapter-pg` (PrismaPg driver adapter) |
| Auth | Clerk | 7.5.20 (admin only, not fully wired) |
| Payments | Razorpay | 2.9.8 (prices stored in paise — Indian rupees) |
| Image Hosting | Cloudinary | 2.10.0 |
| Validation | Zod | 3.25.76 |
| Toasts | Sonner | 2.0.7 |
| Fonts | "Space Grotesk" (body), "Spy Agency" (display/hero) |

---

## Design System

### Colors (defined in `app/globals.css` via `@theme inline`)
| Token | Hex | Use |
|-------|-----|-----|
| `ink-black` | `#0A0A0A` | Deepest black, backgrounds |
| `dark-grey` | `#2B2B2B` | Card backgrounds, surfaces |
| `steel-gray` | `#6B6B6B` | Muted text, borders |
| `light-grey` | `#D8D8D6` | Primary text on dark |
| `signal-red` | `#E11D2E` | Brand accent, CTAs, badges |
| body background | `#0F0F0F` | Page background |

### Fonts
- `--font-sans` → `"Space Grotesk"` (body text)
- `--font-hero` → `"Spy Agency"` (headings, badges, nav)

### Custom CSS Classes (`app/globals.css`)
| Class | Purpose |
|-------|---------|
| `.container-storefront` | Max-width 1200px, centered, 1.5rem padding |
| `.container-wide` | Max-width 1400px, centered, 1.5rem padding |
| `.btn-primary` | Red (#E11D2E) button with hover lift |
| `.product-card` | Dark card with border, hover lift + shadow |
| `.badge` | Small red badge with Spy Agency font |
| `.text-gradient-red` | Solid red text |
| `.section-spacing` | Vertical padding: 5rem / 7rem / 9rem responsive |

---

## Database Models (Prisma)

### Product
- `id`, `title`, `slug` (unique), `price` (paise), `discountedPrice?` (paise), `size?`, `category?`, `condition?` (e.g. "7/10"), `gender?` ("men"/"women"), `details` (String[]), `images` (String[]), `status` ("available"/"sold"), `featured` (Boolean), `createdAt`, `updatedAt`
- Relations: `orderItems`, `wishlists`

### Order
- `id`, `buyerName`, `buyerPhone`, `buyerAddress`, `totalAmount` (paise), `razorpayOrderId?`, `paymentStatus` ("pending"/"paid"/"failed"), `orderStatus` ("placed"/"shipped"/"delivered"), `createdAt`, `updatedAt`
- Relations: `items` (OrderItem[])

### OrderItem
- `id`, `orderId`, `productId`, `price` (at time of purchase)
- Relations: `order` (Cascade), `product` (Restrict)

### SiteSettings
- `id`, `key` (unique), `value`

### Wishlist
- `id`, `visitorId`, `productId`, `createdAt`
- Unique constraint: `[visitorId, productId]`
- Uses localStorage-generated `visitorId` (no login required)

---

## Route Structure

```
app/
├── layout.tsx                    # Root: CartProvider + Toaster only (NO Navbar/Footer)
├── globals.css                   # Tailwind 4 theme, fonts, custom classes
│
├── (storefront)/                 # PUBLIC — has Navbar + Footer via its own layout.tsx
│   ├── layout.tsx               # Wraps with <Navbar /> + <Footer />
│   ├── page.tsx                 # Homepage (hero, product grid, marquee, testimonials, etc.)
│   ├── products/[slug]/page.tsx # Product detail (image zoom, price, details, add-to-cart, wishlist)
│   ├── collections/page.tsx     # All products with filter/sort
│   ├── cart/page.tsx            # Cart with line-through original price + discounted price
│   ├── checkout/page.tsx        # Checkout form
│   ├── order-confirmation/page.tsx
│   └── wishlist/page.tsx        # Wishlist page (client-side, fetches via API)
│
├── admin/                        # ADMIN — NO Navbar/Footer, has sidebar nav
│   ├── layout.tsx               # Sidebar: Dashboard, Products, Orders, Content
│   ├── dashboard/page.tsx
│   ├── products/page.tsx        # Admin product management
│   ├── orders/page.tsx          # Admin order management
│   └── customize/page.tsx       # Hero slides + site settings
│
└── api/                          # REST API routes
    ├── products/route.ts        # GET/POST products
    ├── products/[id]/route.ts   # GET/PUT/DELETE single product
    ├── orders/route.ts          # GET/POST orders
    ├── orders/[id]/route.ts     # GET/PUT/DELETE single order
    ├── round-carousel/route.ts  # GET round carousel images
    ├── upload/route.ts          # Cloudinary image upload
    ├── wishlist/route.ts        # GET/POST/DELETE wishlist (visitorId-based)
    └── razorpay/                # create-order/ + verify/
```

---

## Key Components

### Storefront
| Component | File | Notes |
|-----------|------|-------|
| `PillNavbar` | `pill-navbar.tsx` | Sticky pill navbar, desktop nav links centered, heart icon (wishlist) + cart icon on right, hamburger on mobile |
| `Footer` | `footer.tsx` | Site footer |
| `ProductCard` | `product-card.tsx` | Grid card with image, size badge, cart icon button (adds to cart with toast), discount badge, price |
| `AddToCartButton` | `add-to-cart-button.tsx` | Full-width button with cart SVG icon, "Added!" feedback |
| `WishlistButton` | `wishlist-button.tsx` | White bg, black text, heart SVG icon, toggles via API |
| `CollectionGrid` | `collection-grid.tsx` | Client component with filter/sort state, renders ProductCard grid |
| `FilterModal` | `filter-modal.tsx` | Bottom sheet with Category (data-driven), Size (hardcoded 28-40), Condition (1/10-10/10), Price ranges |
| `ImagePanZoom` | `image-magnifier.tsx` | Hover-to-zoom (2x), cursor follows zoom origin |
| `HeroCarousel` | `hero-carousel.tsx` | Homepage hero slides |

### Admin
| Component | File | Notes |
|-----------|------|-------|
| `ProductForm` | `product-form.tsx` | Full form: title, discounted price, details (add/remove bullets), size, category (with custom input), condition (rating), gender, images (Cloudinary upload) |
| `ProductList` | `product-list.tsx` | Table with Edit/Delete/Sold actions, status badges (Available=green, Sold=red) |
| `ImageUpload` | `image-upload.tsx` | Reusable Cloudinary upload with preview |
| `CustomSelect` | `custom-select.tsx` | Dark themed custom dropdown |
| `HeroSlideList` | `hero-slide-list.tsx` | Hero slide CRUD |
| `OrderList` | `order-list.tsx` | Order management |

---

## Cart System

- **Context:** `lib/cart-context.tsx` — React Context + localStorage (`midrange-cart` key)
- **CartItem:** `{ id, title, slug, price, discountedPrice?, image, size?, quantity }`
- **Behavior:** One item per product (quantity capped at 1), `getCartTotal()` uses `discountedPrice ?? price`
- **Used in:** `ProductCard` (grid icon), `AddToCartButton` (product detail + wishlist page)

## Wishlist System

- **API:** `app/api/wishlist/route.ts` — GET/POST/DELETE, visitorId-based (no login)
- **Visitor ID:** Stored in localStorage as `midrange_visitor_id` (crypto.randomUUID)
- **Button:** `WishlistButton` component on product detail page
- **Page:** `app/(storefront)/wishlist/page.tsx` — grid of wishlisted products with Add to Cart + Remove
- **Navbar:** Heart icon on desktop, "Wishlist" link in mobile menu

---

## Environment Variables

```
DATABASE_URL                    # PostgreSQL (Neon)
CLOUDINARY_CLOUD_NAME           # Cloudinary
CLOUDINARY_API_KEY              # Cloudinary
CLOUDINARY_API_SECRET           # Cloudinary
RAZORPAY_KEY_ID                 # Razorpay (not set yet)
RAZORPAY_KEY_SECRET             # Razorpay (not set yet)
RAZORPAY_WEBHOOK_SECRET         # Razorpay (not set yet)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  # Clerk (not set yet)
CLERK_SECRET_KEY                # Clerk (not set yet)
CLERK_WEBHOOK_SECRET            # Clerk (not set yet)
ADMIN_EMAIL                     # Admin whitelist (not set yet)
```

---

## Known Issues & Notes

1. **Next.js 16 breaking changes** — Read `node_modules/next/dist/docs/` before writing Next.js code
2. **Lint** — use `npm run lint` (`eslint .`); `next lint` fails in this Next.js version. Many pre-existing `react-hooks/set-state-in-effect` warnings across the codebase
3. **Pre-existing TS error** — `scatter-testimonial.tsx` line 143 `Property 'gradient'` (ignored)
4. **Clerk not wired** — No `<ClerkProvider>` in root layout, no middleware, admin is unprotected
5. **Razorpay keys empty** — Payments won't work until `.env` keys are set
6. **Admin pages** have no Navbar/Footer (intentional — separate layout)
7. **Prices in paise** — All prices stored as integers in paise (Indian rupees), divide by 100 to display
8. **Dev server restart needed** — After Prisma schema changes, restart dev server to pick up new client
9. **`eslint` property removed from next.config.ts** — Not valid in Next.js 16's `NextConfig` type

---

## File Paths Quick Reference

| Purpose | Path |
|---------|------|
| Root layout | `app/layout.tsx` |
| Storefront layout | `app/(storefront)/layout.tsx` |
| Admin layout | `app/admin/layout.tsx` |
| Global CSS / Theme | `app/globals.css` |
| Prisma schema | `prisma/schema.prisma` |
| Prisma client | `lib/prisma.ts` |
| Cart context | `lib/cart-context.tsx` |
| Zod schemas | `lib/schemas.ts` |
| Cloudinary config | `lib/cloudinary.ts` |
| Razorpay config | `lib/razorpay.ts` |
| Utils (cn) | `lib/utils.ts` |
| Product card | `components/storefront/product-card.tsx` |
| Add to cart btn | `components/storefront/add-to-cart-button.tsx` |
| Wishlist btn | `components/storefront/wishlist-button.tsx` |
| Filter modal | `components/storefront/filter-modal.tsx` |
| Navbar | `components/storefront/pill-navbar.tsx` |
| Image zoom | `components/storefront/image-magnifier.tsx` |
| Product form (admin) | `components/admin/product-form.tsx` |
| Upload API | `app/api/upload/route.ts` |
| Wishlist API | `app/api/wishlist/route.ts` |
