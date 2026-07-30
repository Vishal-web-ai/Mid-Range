# Rules

Conventions and constraints for anyone (human or AI agent) working on this codebase. Follow these unless a specific task explicitly overrides one.

## Stack constraints
- Next.js App Router only — no Pages Router patterns.
- Tailwind CSS for all styling — no separate CSS files except global resets/fonts. No CSS-in-JS libraries.
- PostgreSQL via Prisma only — no raw SQL unless Prisma genuinely cannot express the query, and if so, comment why.
- Server Components by default; use `"use client"` only where interactivity (state, event handlers, browser APIs) is actually needed.

## Code conventions
- TypeScript everywhere, strict mode on. No `any` unless truly unavoidable — comment why if used.
- File/folder naming: kebab-case for files, PascalCase for component names.
- One component per file for anything reusable (in `components/`); page-specific composition can live in the route's `page.tsx`.
- Environment variables: never hardcode secrets. All secrets in `.env.local`, referenced via `process.env`. Add new required vars to `.env.example`.

## Data and money handling
- All prices stored and calculated in the smallest currency unit (paise, not rupees) to avoid floating-point errors, converted to rupees only for display.
- Razorpay payment verification MUST happen server-side via signature check — never mark an order "paid" based on a client-side callback alone.
- Any schema change goes through a Prisma migration — never edit the database manually outside of migrations.

## Admin panel
- Every admin route must be protected via Clerk middleware, server-side — never rely on hiding a link in the UI as the only protection.
- Clerk allows public sign-up by default — restrict admin access to your friend's specific account (allowlist by email/user ID), not "any authenticated Clerk user."
- Image uploads go to Cloudinary; only the resulting URL is stored in Postgres — never store binary image data in the database.
- Admin UI must work on a basic Android phone browser — assume the owner may manage products from their phone, not just a laptop.

## UI/animation
- Preloader (zipper intro) runs once per browser via `localStorage` key `hasSeenZipper` — check for the key before rendering anything, skip instantly if present, set it after the first-run animation completes. Must skip straight to the open state under `prefers-reduced-motion: reduce`. No animation library — vanilla CSS 3D transforms + plain JS timing. See DESIGN.md for full spec.
- Hero is an autoplay 3D coverflow carousel — no user interaction (no arrows/dots/swipe), fixed 3.5s interval, `cubic-bezier(0.25, 1, 0.5, 1)` transitions. No animation library — vanilla CSS 3D transforms + plain JS index rotation. Must pause under `prefers-reduced-motion: reduce`. Below ~640px, render 3 cards (not 5) with reduced blur/3D depth for mobile performance — see DESIGN.md "Mobile responsiveness" for exact spec. Build and test the mobile version first, don't retrofit it from the desktop version.
- Scroll-reveal, marquee, and parallax specs are defined in DESIGN.md — follow those exactly, especially the parallax accessibility rule (must fully disable under `prefers-reduced-motion`, not just reduce).
- Never use an unthrottled scroll event listener for parallax — use `animation-timeline: scroll()` where supported, or a throttled `requestAnimationFrame` fallback.
- Marquee must use CSS `@keyframes`, not JS-driven scroll position updates.
- "Spy Agency" font family (5 variants: Regular, Bold, Condensed, Semi-Italic, College) is hero/badge/marquee text only — none of the 5 have a ₹ glyph. Never apply any Spy Agency variant to prices, product descriptions, admin UI, or any dynamic/user-generated content. Use Space Grotesk everywhere else, per DESIGN.md.
- Prefer CSS transforms/opacity and IntersectionObserver for scroll/entrance animations over animation libraries (Framer Motion, GSAP), consistent with prior performance decisions on this stack.
- All animations must respect `prefers-reduced-motion`.
- Mobile-first: build and test the mobile layout before the desktop layout, not after.

## Git / workflow
- Commit messages: short, present tense (`add product admin form`, not `Added product admin form`).
- No committing `.env` files or API keys, ever.
- Feature branches for anything beyond a trivial fix; main branch should always be deployable.

## When acting as an AI coding agent on this repo
- **Read MEMORY.md first, every session, before reading any source code.** It exists to answer "what's already built and why" without re-scanning the codebase. Only open source files directly when you're about to edit them or MEMORY.md doesn't cover what you need.
- **Append a dated entry to MEMORY.md's Build log at the end of every session or completed chunk of work** — what was built, which files, any new decisions, current status. This is not optional; skipping it means the next session burns tokens re-discovering context this session already had.
- Follow the Build sequence in PHASES.md for Feature phase 1 work: all routes (design + functionality) first, then auth, then payment, then deploy. Don't wire up Vercel, GitHub, or live deploys ahead of that order unless explicitly asked to jump ahead.
- Build-steps 1–3 (routes, auth, payment) all stay on localhost only — no Vercel deploy, no public URL, no GitHub repo push required to work. Deployment is Build-step 4, done only when Vishal is ready to publish.
- Never deploy the unprotected admin routes (post Build-step 1, pre Build-step 2) to a public production URL — local/private preview only.
- Read PRD.md, ARCHITECTURE.md, DESIGN.md, and PAGES.md before generating new features — don't invent data models, routes, or pages that conflict with them.
- If a request would require deviating from these rules (e.g. adding a new library, changing the data model significantly), flag it explicitly rather than silently doing it.
- Match existing code style in the repo over introducing a new pattern, even if you'd personally prefer the new pattern.
