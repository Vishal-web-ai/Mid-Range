# Phases

This file covers two different things — don't conflate them:
- **Feature phases** (below): what ships in v1 (MVP) vs later (Trust and growth, Nice-to-have) — the scope tiers.
- **Build sequence** (further down): the order to actually implement Phase 1/MVP work in — routes first, then auth, then payment. This is how the AI coding agent should work through Phase 1, not a different feature scope.

## Phase 0 — Setup
- [ ] Next.js project init, Tailwind configured
- [ ] Postgres database provisioned (Neon/Supabase)
- [ ] Prisma schema defined and migrated
- [ ] Cloudinary account + upload preset configured

## Feature phase 1 — MVP (ship this first)
- [ ] Product data model + Prisma migrations
- [ ] Admin auth (login for owner only)
- [ ] Admin panel: add / edit / delete product, mark sold, upload images
- [ ] Storefront: hero section (animated, red/black/white)
- [ ] Storefront: product grid + product detail page
- [ ] Cart (client-side state, no login required)
- [ ] Razorpay checkout integration + server-side payment verification
- [ ] Order confirmation (email or SMS)
- [ ] Fully responsive, mobile-first
- **Exit criteria**: owner can list a real product and a real buyer can complete a real paid order, end to end.

## Feature phase 2 — Trust and growth
- [ ] Return / shipping / exchange policy page
- [ ] Order status tracking page for buyers
- [ ] WhatsApp click-to-chat support button
- [ ] Instagram feed embed on homepage
- [ ] Reviews / ratings on product pages
- [ ] Homepage testimonial section — needs real customer quotes, launch with a small number of honest early-access quotes (see DESIGN.md: Testimonial section)
- **Exit criteria**: a new visitor with no prior relationship to the store can reasonably trust it enough to pay.

## Feature phase 3 — Nice-to-have
- [ ] Wishlist / save for later
- [ ] Filters: size, price range, category
- [ ] Low-stock / one-of-one urgency badges
- [ ] Coupon codes
- [ ] Basic sales dashboard for the owner (revenue, top items, order volume)

## Build sequence (implementation order for Feature phase 1 / MVP)

This is the order the AI coding agent should actually build Feature phase 1 in — routes and UI first, then auth, then payment. Not a different feature scope, just a build order for the same MVP work.

### Build-step 1 — All routes: design + functionality
- Build every route from PAGES.md with real UI and working client-side functionality — but no real auth, no real payment processing yet.
- **Stays on `localhost` only for this entire step** — no Vercel deploy, no public URL. Vishal wants to build and review the entire site locally, including auth and payment, before anything goes public. Deployment doesn't happen until Build-step 4.
- Includes: homepage (preloader, hero carousel, marquee, trust, about, testimonials, showcase, product grid, FAQ, footer), product detail, cart, checkout page UI, order confirmation UI, and the admin panel UI (product list/add/edit forms, orders list).
- Cart logic (add/remove/subtotal) should be fully functional client-side.
- Checkout page should have a working form and a "pay" button, but the actual Razorpay call can be stubbed/mocked at this stage.
- Admin panel CRUD should actually read/write to Postgres via Prisma — that's real functionality, just not yet access-controlled.
- **Critical**: at the end of this step, `/admin/*` routes are functional but unprotected. This state must stay local-only / on a private preview deploy — never push it to a public production URL before Build-step 2 adds auth.

### Build-step 2 — Auth
- Wire in Clerk, gate all `/admin/*` routes server-side, restrict access to your friend's specific account (see RULES.md).
- No new pages here — this step makes the existing admin routes from Build-step 1 actually secure.

### Build-step 3 — Payment system
- Razorpay account created, test mode keys obtained.
- Wire in real Razorpay: order creation, Checkout widget, server-side signature verification (see ARCHITECTURE.md: Checkout flow).
- Replace the stubbed "pay" button from Build-step 1 with the real flow.
- Test with Razorpay test-mode keys before switching to live keys.
- Only after this step is the site safe to take real customer payments — but it's still local-only at this point, see Build-step 4.

### Build-step 4 — Deploy
- Everything up to here (routes, auth, payment) has been built and tested entirely on `localhost`. This is the first step that touches the public internet.
- Repo pushed to GitHub.
- Vercel project created and connected to the repo.
- Environment variables (Postgres URL, Cloudinary keys, Razorpay keys, Clerk keys) set in Vercel — never committed to the repo.
- Prisma migrations run against the production database (`npx prisma migrate deploy`).
- Switch Razorpay from test-mode to live keys only once everything else is verified working.

## Sequencing notes
- Do not start Phase 2 until Phase 1's exit criteria is actually met with a real transaction — a working payment flow that's never been used for a real order will have bugs you haven't found yet.
- Design/hero polish work can happen in parallel with backend/admin work, but checkout + admin panel are the critical path — prioritize those over visual polish for v1.
