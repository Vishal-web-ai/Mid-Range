# Architecture

## Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (hosted on Neon or Supabase, free tier)
- **ORM**: Prisma
- **Image hosting**: Cloudinary (upload + on-the-fly transforms/thumbnails)
- **Payments**: Razorpay (Checkout + Orders API)
- **Auth (admin only)**: Clerk (hosted auth, prebuilt sign-in UI)
- **Hosting**: Vercel

## Why this stack
- Next.js gives frontend + API routes in one deployable app — no separate backend server/host to manage.
- Postgres + Prisma gives relational integrity for orders/products and type-safe queries.
- Cloudinary offloads image storage and resizing so Postgres only stores URLs.
- Razorpay is UPI-native and PCI-compliant out of the box — no custom payment/security code needed.
- Clerk handles auth (sign-in UI, session management, password resets) out of the box — no need to hand-roll password hashing or session logic for a single admin user.

## High-level structure

See PAGES.md for what each route is for and what's on it — this is just the technical file layout.

```
app/
  (storefront)/
    page.tsx              -> homepage / hero + product grid
    products/[slug]/page.tsx
    cart/page.tsx
    checkout/page.tsx
  admin/
    layout.tsx             -> auth-gated
    products/page.tsx      -> list + add/edit
    orders/page.tsx
  api/
    products/route.ts
    products/[id]/route.ts
    orders/route.ts
    razorpay/create-order/route.ts
    razorpay/verify/route.ts
lib/
  prisma.ts
  cloudinary.ts
  razorpay.ts
prisma/
  schema.prisma
```

## Data model (initial)

**Product**
- id, title, description, price, size, category, condition, images (array of URLs), status (available / sold), createdAt

**Order**
- id, buyerName, buyerPhone, buyerAddress, items (relation to OrderItem), totalAmount, razorpayOrderId, paymentStatus, orderStatus (placed / shipped / delivered), createdAt

**OrderItem**
- id, orderId, productId, price at time of purchase

## Key flows

**Checkout**
1. Buyer submits cart -> `POST /api/razorpay/create-order` creates a Razorpay order and a pending Order row.
2. Razorpay Checkout widget opens client-side.
3. On success, Razorpay returns a signature -> `POST /api/razorpay/verify` verifies it server-side using the webhook secret, then marks the Order as paid.
4. Never trust client-side "payment success" alone — always verify server-side before marking an order paid.

**Admin product management**
1. Owner logs in via Clerk's hosted sign-in page -> Clerk manages the session.
2. Add product form uploads images directly to Cloudinary (unsigned upload preset, or signed via API route) and gets back URLs.
3. Form submits product data + image URLs to `POST /api/products`, saved via Prisma.

## Deployment
- Vercel project connected to GitHub repo, auto-deploy on push to main.
- Environment variables (Postgres URL, Cloudinary keys, Razorpay keys, NextAuth secret) set in Vercel dashboard — never committed to the repo.
- Prisma migrations run via `npx prisma migrate deploy` as part of the build/deploy step.

## Security notes
- Admin routes protected by Clerk middleware (`clerkMiddleware`) checking the session — restrict access to your friend's account specifically (allowlist by email/user ID, not just "any logged-in user"), since Clerk by default allows anyone to sign up.
- Razorpay webhook signature must be verified server-side (never trust client callback alone).
- Environment secrets never exposed to client bundle — only `NEXT_PUBLIC_` prefixed vars are safe client-side.
