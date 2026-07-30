# Pages / Routes

Every route on the site, what it's for, and what's on it. Cross-references DESIGN.md for visual spec, PHASES.md for build order, ARCHITECTURE.md for the technical file structure this maps onto.

## Storefront

### `/` — Home
**Phase**: 1 (MVP), with two sections noted below as Phase 2 dependencies
Sections in order:
1. Preloader (first-visit only, see DESIGN.md: Preloader)
2. Hero: autoplay 3D coverflow carousel (see DESIGN.md: Hero section)
3. Marquee announcement ticker (see DESIGN.md: Animation guidelines)
4. **Trust section** — "Why trust MidRange" (see DESIGN.md: Trust section)
5. **About MidRange** — brand story section (see DESIGN.md: About section)
6. **Testimonials** — scroll-reveal cards with rating, buyer name, product thumbnail (see DESIGN.md: Testimonial section). *Phase 2 in practice — needs real customer quotes, which don't exist until MidRange has real sales through the new site. Launch with a few honest early-access quotes, don't fake it.*
7. **Store showcase gallery** — Instagram-style photo grid (see DESIGN.md: Store showcase section)
8. Product grid (new arrivals) — Phase 1
9. **FAQ accordion** (see DESIGN.md: FAQ section)
10. **Footer** (see DESIGN.md: Footer)

Primary entry point — most traffic lands here from Instagram/WhatsApp referral.

### `/products/[slug]` — Product detail
**Phase**: 1 (MVP)
- Product photos, title, price, size, condition, description.
- Add to cart action.
- Related/similar items (phase 2+, optional).

### `/cart` — Cart
**Phase**: 1 (MVP)
- List of added items, quantities (usually 1, thrift items are one-of-one), subtotal.
- Proceed to checkout action.

### `/checkout` — Checkout
**Phase**: 1 (MVP)
- Buyer details form (name, phone, address).
- Razorpay checkout handoff.
- See ARCHITECTURE.md: Checkout flow for the technical sequence.

### `/order-confirmation` (or `/orders/[id]`) — Order confirmation
**Phase**: 1 (MVP)
- Shown immediately after successful payment.
- Order summary, confirmation that email/SMS was sent.

### `/orders/[id]/track` — Order tracking
**Phase**: 2 (Trust and growth)
- Buyer-facing order status (placed / shipped / delivered).

### `/policies/returns` (or similar) — Return, shipping, exchange policy
**Phase**: 2 (Trust and growth)
- Static content page. Needs real policy text from your friend before this can be finished (see MEMORY.md open questions).

## Admin

### Admin auth
**Phase**: 1 (MVP)
- Handled by Clerk's hosted sign-in — not a custom-built page, but restricted to your friend's account only (see RULES.md).

### `/admin/products` — Product management
**Phase**: 1 (MVP)
- List all products, add/edit/delete, mark sold, upload images via Cloudinary.
- This is the core "no developer needed" requirement from PRD.md — must work cleanly on a phone browser.

### `/admin/orders` — Order management
**Phase**: 1 (MVP)
- List incoming orders, update status (placed/shipped/delivered).

### `/admin/dashboard` — Sales overview
**Phase**: 3 (Nice-to-have)
- Revenue, top items, order volume — see PHASES.md.

## Not yet routed (open questions)
- Wishlist page — phase 3, no route decided yet.
- Filtered/category browsing — may be a query param on `/` (e.g. `/?category=hoodies`) rather than a separate route; decide when building the product grid.
