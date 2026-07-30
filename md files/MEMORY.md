# Project memory

**AI agents: read this file first, before reading the codebase, at the start of every session.** This file exists specifically so you don't need to re-scan the whole project for context every time — that costs tokens for no reason once this file is kept current. Only read source files directly when you're about to edit them or when this file doesn't answer your question.

Persistent context for this project. Read this first when picking up work after a break, or when handing off to an AI coding agent.

## What this project is
A Gen-Z thrift clothing store website, brand name **MidRange**, for a friend's business. Built by Vishal as a paid freelance project (real client, real deadline pressure, not just a portfolio exercise).

## Stack (locked in)
- Next.js (App Router) + Tailwind CSS + PostgreSQL + Prisma
- Cloudinary for images
- Razorpay for payments
- Clerk for admin login (hosted auth, prebuilt sign-in UI)
- Hosted on Vercel, DB on Neon or Supabase

## Key decisions already made
- Full e-commerce (cart + real checkout), not just a showcase/DM-to-buy site.
- Custom-built admin panel (not Shopify/WordPress) so the owner can manage products without a developer, and so Vishal keeps full code ownership/control.
- Payments handled via Razorpay rather than custom payment logic — avoids taking on PCI/security risk.
- Visual direction: grayscale + single red accent, streetwear/Gen-Z aesthetic — see DESIGN.md. No white or off-white in the palette. Background is a single full-page radial vignette (Light Grey center, darkening to Dark Grey at screen edges), Ink Black is primary text, Signal Red is secondary text/highlights/CTAs. Since the main content column sits centered (lightest part of the vignette), Ink Black works as default text almost everywhere — Light Grey only needed as "text on dark" for full-bleed elements that touch the darkened screen edges. Originally inspired by a Behance design-studio reference (bold type, red/black/gray, Space Grotesk body font) — borrowing color/type/photo mood, deliberately not copying its exposed "design system" chrome.
- Hero section was replaced: no longer the two-part light-grey/black-block structure. Hero is now an autoplay 3D coverflow carousel (center card sharp/scaled up, side cards blurred/rotated in 3D, no user interaction, 3.5s autoplay interval, infinite loop). Sits on the standard vignette background — the earlier black-background/white-text exception no longer applies anywhere on the site. See DESIGN.md for full spec.
- Added a first-visit-only preloader: a "zipper opening" intro overlay (two flaps peel open in 3D) that plays once per browser via localStorage, then never again for that visitor. Plays before the hero carousel. Skips instantly for returning visitors and for prefers-reduced-motion users.
- Home page section order after hero: marquee ticker, trust section ("why trust MidRange"), about/brand story, testimonials (scroll-reveal cards), store showcase gallery (Instagram-style grid), product grid, FAQ accordion, footer. See PAGES.md and DESIGN.md for full specs of each.
- Hero display font is the "Spy Agency" family (5 variants: Regular, Bold, Condensed, Semi-Italic, College), replacing an earlier single-weight font ("Thats Super"). Bold for main headlines, Condensed for the marquee ticker, College for badge/stamp treatments, Semi-Italic for accent lines. Same constraint as before: no ₹ glyph in any variant, so hero/badge/marquee text only — never prices or dynamic content.
- Phase 1 (MVP) must include a real working payment flow before any trust/growth features are built — see PHASES.md.

## Related prior work to reuse
- Hero section animation patterns (glow/reveal entrance, JS replay mechanism) from earlier animated hero work — adapt rather than rebuild from scratch.
- Scroll-reveal card pattern (vanilla IntersectionObserver + CSS, no animation library) from prior rocket.new-inspired work — reuse this approach for the product grid reveal.
- Dark theme + accent color UI patterns from the Udhaar app project are a useful reference for the black/red palette execution, though Udhaar's accent is orange, not red.

## Open questions / unresolved (check with the store owner)
- Local pickup vs courier shipping for v1.
- Exact return/exchange policy terms.
- Exact brand red hex — does the store have an existing logo to match?
- Owner's preference: email or SMS order notifications.

## Where things stand
Planning phase in progress: PRD, Architecture, Design, Phases, Rules, Pages/Routes docs written. No code written yet. Next step: Phase 0 setup, then Build-step 1 (all routes: design + functionality) → Build-step 2 (auth) → Build-step 3 (payment) → Build-step 4 (deploy). Everything through payment stays on localhost only — Vishal wants to build and review the whole site locally before publishing anything. GitHub/Vercel setup happens at the very end (Build-step 4), not upfront. See PHASES.md "Build sequence."

## Build log — mandatory, update every session

**Rule for AI agents**: at the end of every work session (or after completing any meaningful chunk of work — a feature, a page, a bugfix), append a new dated entry below. Each entry should be specific enough that the next session doesn't need to open the codebase to know what state things are in:
- What was built/changed (feature or page name, referencing PAGES.md/PHASES.md where relevant)
- Which files were created or significantly modified (paths, not full diffs)
- Any decision made that isn't already captured elsewhere in this file or in PRD/ARCHITECTURE/DESIGN/RULES
- Current status (done / in progress / blocked — and on what)

Keep entries terse — this is a log, not a narrative. Newest entry at the top.

Do not delete old entries. If this file grows too large, summarize older entries into a shorter form rather than deleting the history outright — ask Vishal before removing anything.

---

### 2026-07-17
- Built: cart state management + 9 storefront/shared UI components
- Files:
  - `lib/cart-context.tsx` — CartProvider + useCart hook with localStorage persistence (key: `midrange-cart`), addItem/removeItem/updateQuantity/clearCart/getCartTotal/getItemCount
  - `components/ui/scroll-reveal.tsx` — IntersectionObserver-based fade+slide-up wrapper, supports stagger delay, respects prefers-reduced-motion
  - `components/storefront/hero-carousel.tsx` — 3D coverflow carousel, 5/3 cards (desktop/mobile), autoplay 3.5s, cubic-bezier transitions, CSS perspective/rotateY/blur, infinite loop, pauses under reduced-motion
  - `components/storefront/preloader.tsx` — Zipper opening overlay, left/right flaps + pull tab, 3D rotateY peel, requestAnimationFrame timing, localStorage skip, reduced-motion skip
  - `components/storefront/marquee.tsx` — Infinite CSS @keyframes marquee in Spy Agency Condensed, Signal Red, pause on hover/tap
  - `components/storefront/trust-section.tsx` — 4-point grid (2-col mobile, 4-col desktop), SVG icons, ScrollReveal staggered
  - `components/storefront/about-section.tsx` — Split layout (image + brand story), ScrollReveal
  - `components/storefront/showcase-gallery.tsx` — 2-4 col Instagram grid, ScrollReveal staggered, picsum placeholders
  - `components/storefront/faq-section.tsx` — Native `<details>`/`<summary>` accordion with Signal Red expand indicator
  - `components/storefront/footer.tsx` — Server component, nav/policy/social links, Light Grey text on vignette
- Decision: all prices stored in paise (matching project convention); thrift items capped at quantity 1; footer is a Server Component (no interactivity needed); marquee uses inline `<style>` for `@keyframes` since Tailwind v4 doesn't cover custom animations natively
- Status: all 10 files complete, waiting for review

<!-- Newest entries go here, above this line. Example format:

### 2026-07-20
- Built: product detail page (`/products/[slug]`)
- Files: app/(storefront)/products/[slug]/page.tsx, components/ProductGallery.tsx
- Decision: image gallery uses a simple thumbnail strip, not a lightbox — kept scope tight for MVP
- Status: done, not yet tested on mobile

-->

### 2026-07-17
- **Build-step 1 complete**: All routes built with real UI and working client-side functionality
- **Files created/updated**:
  - `app/layout.tsx` — root layout with CartProvider, Navbar, Footer
  - `app/(storefront)/page.tsx` — homepage assembling all sections
  - `app/(storefront)/products/[slug]/page.tsx` — product detail with gallery + add-to-cart
  - `app/(storefront)/cart/page.tsx` — cart with items, subtotal, checkout CTA
  - `app/(storefront)/checkout/page.tsx` — checkout form with Zod validation, stubbed Razorpay
  - `app/(storefront)/order-confirmation/page.tsx` — success confirmation
  - `app/admin/layout.tsx` — admin layout with sidebar nav
  - `app/admin/products/page.tsx` — product list (server component)
  - `app/admin/orders/page.tsx` — order list (server component)
  - `components/storefront/navbar.tsx` — sticky nav with cart badge + mobile drawer
  - `components/storefront/preloader.tsx` — zipper opening intro (localStorage gated)
  - `components/storefront/hero-carousel.tsx` — 3D coverflow autoplay carousel
  - `components/storefront/marquee.tsx` — infinite CSS marquee ticker
  - `components/storefront/trust-section.tsx` — 4 trust points with icons
  - `components/storefront/about-section.tsx` — brand story split layout
  - `components/storefront/showcase-gallery.tsx` — Instagram-style photo grid
  - `components/storefront/product-card.tsx` — product card component
  - `components/storefront/product-grid.tsx` — server component fetching from Prisma
  - `components/storefront/add-to-cart-button.tsx` — client add-to-cart with feedback
  - `components/storefront/faq-section.tsx` — native details/summary accordion
  - `components/storefront/footer.tsx` — footer with nav + social links
  - `components/ui/scroll-reveal.tsx` — IntersectionObserver scroll reveal
  - `components/admin/product-list.tsx` — admin product table/cards with CRUD actions
  - `components/admin/product-form.tsx` — add/edit product form
  - `components/admin/order-list.tsx` — admin order table/cards with status actions
  - `app/api/products/route.ts` — GET (list+filter) + POST (create) with Zod
  - `app/api/products/[id]/route.ts` — GET + PUT + DELETE
  - `app/api/orders/route.ts` — GET + POST with Zod
  - `app/api/orders/[id]/route.ts` — GET + PUT (status update) with Zod
  - `app/api/razorpay/create-order/route.ts` — stubbed
  - `app/api/razorpay/verify/route.ts` — stubbed
  - `lib/cart-context.tsx` — React Context cart state with localStorage
  - `lib/schemas.ts` — all Zod schemas (Product, Order, Razorpay)
  - `lib/prisma.ts` — lazy proxy Prisma client (build-safe)
  - `app/globals.css` — design system tokens, vignette bg, marquee keyframes
- **Design improvements applied**:
  - Installed anthropics/skills@frontend-design (674K installs)
  - Added frontend-design principles to .cursorrules
  - Rewrote trust section copy to be specific (not generic e-commerce)
  - Rewrote about section copy with brand voice ("One person's closet, another's favorite thing")
  - Fixed order confirmation to use Signal Red instead of generic green
  - Marquee now uses Spy Agency Condensed font + CSS keyframes from globals.css
  - Trust section headings use Spy Agency for personality
- **Plugin installs**: zod, openapi-typescript, swagger-ui-react, jest, @playwright/test, prettier, eslint-config-prettier, prettier-plugin-tailwindcss, @dietrichgebert/ponytail, clsx, tailwind-merge
- **Config files**: .cursorrules, jest.config.mjs, playwright.config.ts, .prettierrc, .prettierignore
- **Tests**: 11 Jest tests passing (Zod schema validation), 1 Playwright E2E skeleton
- **Build**: successful (15 routes), TypeScript zero errors, Prettier formatted
- **Status**: Build-step 1 DONE. Next: Build-step 2 (Clerk auth for admin)

