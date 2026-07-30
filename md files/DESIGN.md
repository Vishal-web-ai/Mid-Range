# Design

## Visual direction
Bold, young, streetwear-adjacent, high-contrast. Should feel like a Gen-Z fashion drop, not a generic e-commerce template.

## Reference
Visual direction is inspired by a Behance design-studio reference (bold condensed type, red/black/gray, dramatic B&W photography). We're borrowing the color/type confidence and photography mood — not the exposed "design system" chrome (grid labels, `#GRID_SYSTEM` tags, visible column markers). The site should read as a normal, easy-to-shop e-commerce layout that happens to look this bold, not a design portfolio.

## Color palette
No white, no off-white. Palette is grayscale + one accent red.

- **Light Grey** — `#D8D8D6` (base background color, bottom/majority of the page)
- **Dark Grey** — `#2B2B2B` (top-of-page shading, see Background shading below)
- **Ink Black** — `#0A0A0A` (primary text — headlines, body copy, prices)
- **Signal Red** — `#E11D2E` (secondary text, highlight tags, CTAs, sale badges — the one accent color)
- **Steel Gray** — `#6B6B6B` (borders/dividers only, muted, not used for text)

## Background shading
Full-page background uses a **radial vignette**: Light Grey at the center, darkening toward Dark Grey at the screen edges. Applied once across the whole page (fixed/full-viewport), not per-section, so it reads as one continuous atmospheric backdrop behind all content as the user scrolls, rather than a repeated effect per block.

**Exact CSS**:
```css
background: radial-gradient(
  circle at center,
  #D8D8D6 0%,
  #D8D8D6 30%,
  #7a7a78 68%,
  #2B2B2B 100%
);
```
The flat `#D8D8D6` hold through 0–30% keeps the entire central content column uniformly light (not just a single point at dead-center) — the transition to Dark Grey only begins past 30%, reaching full Dark Grey at the very edge. This is the reference implementation; treat these exact stop values as final, not a rough approximation.

**Contrast rule — important**: since primary content (headlines, product grid, text) sits in the horizontally-centered content column, it naturally lands in the lighter center of the vignette, where Ink Black text has good contrast. Ink Black is safe as the default primary text color across nearly all sections as a result. The only place to double check is any full-bleed edge-to-edge element (e.g. a full-width hero image caption, or a nav bar that touches the screen edges) — if text sits within the darker vignette zone at the very edges, use **Light Grey** as the text color there instead of Ink Black. Define both as tokens (`text-on-dark` = Light Grey, `text-on-light` = Ink Black) and apply based on actual position within the vignette, not by section type.

## Typography
- **Hero display font family**: "Spy Agency" (Vishal-provided TTFs) — used **only** for hero section headline/accent text. Five variants available:
  - **Spy Agency Bold** — main hero headline / impact word
  - **Spy Agency Condensed** — tight spaces: nav wordmark, small badges, marquee ticker text
  - **Spy Agency Semi-Italic** — secondary/accent line beneath a bold headline
  - **Spy Agency College** — varsity/stamp treatment for badges (e.g. "ONE OF ONE", "EST.")
  - **Spy Agency (Regular)** — general-purpose fallback within the family if none of the above fit
  - Constraints: none of the 5 variants have a ₹ symbol (219 glyphs each, basic Latin + punctuation only). Do not use for prices, section headers elsewhere, body text, or admin UI — hero/badge/marquee text only, never currency or dynamic content.
- **Everything else (section headers, prices, descriptions, UI)**: Space Grotesk — geometric, highly readable, has full glyph support including ₹.
- Avoid introducing further font families beyond this hero family + Space Grotesk.

## Layout principles
- Mobile-first: design for a 375–414px viewport first, scale up.
- Visual rhythm comes from the single continuous background vignette (Light Grey center, Dark Grey edges — see Background shading) rather than alternating hard-cut section colors — sections should feel like one continuous surface, not stacked blocks.
- Product grid: 2 columns on mobile, 3–4 on desktop. Square or portrait product images, consistent aspect ratio.
- Generous whitespace around CTAs — don't let the boldness tip into clutter.

## Preloader / first-visit intro

A **Zipper Opening Transition** — a fullscreen intro overlay that splits open like a jacket/clothing zipper to reveal the site underneath. Runs once per visitor, not on every page load.

**First-time visitor logic (crucial)**
- Uses `localStorage` key `hasSeenZipper` to detect repeat visitors.
- If the key exists → skip the preloader instantly, no delay, no flash of the overlay.
- If it's a first visit → run the animation once, then set the key so it never plays again for that browser/device.
- Note: this is per-browser, not per-account — a returning visitor on a new device or after clearing storage will see it again. That's expected and fine for this use case.

**Overlay structure**
- Fixed, fullscreen container, `z-index: 9999`, split into two equal halves (Left Flap, Right Flap, `50vw` each).
- A centered vertical line down the middle with a zipper "pull tab" element at the top.

**Animation sequence**
1. Wait 1 second after `DOMContentLoaded` (lets background assets/fonts load first, avoids the reveal looking broken behind the zipper).
2. Pull tab animates smoothly from `top: 0` to `top: 100%`.
3. As the tab descends, Left and Right flaps peel open using 3D transforms (`transform: translateX() rotateY()`, with `perspective` set on the wrapper) — flaps fold backward in 3D space, not a flat slide.
4. Once fully open: overlay opacity → 0, `pointer-events: none` (or `display: none`), so it stops blocking clicks on the real site underneath.

**Technical stack**: vanilla HTML/CSS/JS — no animation library, consistent with the rest of the site's animation approach. CSS transitions handle the motion; JS only handles timing sequencing and the `localStorage` check.

**UX note**: since this delays first-time visitors from reaching the actual shop by ~1–2 seconds, keep the total sequence tight — the 1s wait + animation duration should stay well under 3 seconds total, or it starts costing you impatient mobile shoppers before they've seen a single product.

**Accessibility**: skip the animation (jump straight to the open state) under `prefers-reduced-motion: reduce` — don't force a multi-second 3D transition on users who've opted out of motion.

## Hero section
Autoplay 3D Coverflow Carousel — replaces the earlier two-part (light-grey + black block) hero concept entirely.

**Visual pattern**: Horizontal Perspective Focus Carousel. The center card sits flat, scaled up, sharp, and highlighted. Adjacent cards to the left and right are visibly peeked but scaled down, rotated in 3D space, and blurred — giving depth via CSS 3D transforms rather than flat sliding.

**Strict functional requirements**
1. **No user interaction** — no navigation arrows, no pagination dots, no draggable/swipe behavior. Fully passive/autoplay.
2. **Smooth autoplay** — rotates automatically and infinitely, advancing every 3.5 seconds. Transition between cards uses `cubic-bezier(0.25, 1, 0.5, 1)` over 0.6 seconds for a buttery, non-linear ease.
3. **Infinite loop** — reaching the last card loops smoothly back to the first, no jarring snap and no break in the 3D perspective structure.
4. **Card layout** — each card is a clean modern block: top image area (`object-fit: cover`, rounded corners), bottom text container with a short heading and one-line description.

**Card content**: product/drop photos with a short title (e.g. product name or "Drop 01") and one-line description — this is the site's primary visual introduction, so use real (or representative) product photography, not lifestyle-only shots.

**Typography inside cards**: heading text can use "Spy Agency Bold" (per Typography section); description text uses Space Grotesk.

**Color/background**: carousel sits on the site's standard vignette background (Light Grey center, Dark Grey edges — see Background shading), not a solid black block. The earlier hero's black-background-plus-white-text treatment is removed along with the rest of the old hero — there is currently no section on the site using solid black + white text. If a future section wants that treatment again, it needs to be re-approved as an explicit palette exception, same as before.

**Technical stack**: semantic HTML, Tailwind CSS for layout/spacing/typography utilities, plain CSS (`perspective`, `transform: rotateY() translateZ()`, `filter: blur()`) for the 3D-specific properties Tailwind doesn't cleanly cover, and lightweight vanilla JS to manage the active-index rotation on a timer. No animation library (GSAP, Framer Motion) — this effect is a fixed-interval, non-interactive CSS transition and doesn't need one; matches the site's existing no-animation-library rule.

**Accessibility**: since this is a passive, continuously-moving element, it should pause under `prefers-reduced-motion: reduce` (show the center card statically rather than force continuous motion on users who've asked for less of it).

**Mobile responsiveness** (below ~640px width)
- **Card count**: 3 cards instead of 5 — center card + one blurred/rotated card on each side (not two). Prevents cramping/overflow on narrow screens and reduces the number of simultaneously-rendered 3D-transformed elements.
- **Reduced effect intensity**: lighter blur values and shallower rotation/translateZ depth than desktop — prioritizes smooth performance on mid-range Android phones (this site's primary buyer device, per PRD) over exact visual parity with desktop. Desktop can afford heavier blur/depth since it's typically higher-powered hardware.
- **Autoplay interval and easing** (3.5s, `cubic-bezier(0.25, 1, 0.5, 1)`) stay the same across breakpoints — timing consistency matters more than visual depth here.
- **Card and text sizing** scale down proportionally to fit mobile viewport widths (375–414px reference, per Layout principles) — test at that width first, not as an afterthought.

## Product photography
- Reference uses dramatic studio B&W shots — real inventory will be a mix of studio-style and casual phone photos, so the design must not depend on consistently high-end photography.
- Standardize what you *can* control: consistent aspect ratio (e.g. 4:5 portrait) and consistent background/cropping via Cloudinary transforms, even when input photo quality varies.
- Consider a subtle consistent overlay/frame treatment on product cards (not on the photo itself) so mixed photo quality still feels visually unified in the grid.
- Don't force B&W across all product photos — thrift buyers need to see true color/condition. Save moody B&W treatment for hero/marketing imagery only, not product listings.

## Trust section — "Why trust MidRange"
Homepage section, sits after the marquee, before About.
- Grid of 3–4 short trust points, each: a Tabler-style icon, a short bold heading, one line of supporting copy. Not paragraphs — scannable at a glance.
- Suggested points (confirm specifics with your friend): real photos of actual items (no stock images), secure checkout (Razorpay/UPI), easy returns (link to policy once written), one-of-one pieces (thrift honesty angle).
- Sits on the standard vignette background, Ink Black headings, Signal Red icons, Space Grotesk body copy.
- Scroll-reveal on entry (see Animation guidelines), staggered per item.

## About section — brand story
- Short brand story/mission for MidRange — who's behind it, why it exists, what makes it different from generic fast fashion. Needs real copy from your friend; don't invent brand history.
- Layout: image (founder or store photo) on one side, text block on the other — standard split layout, stacks vertically on mobile (image above text).
- Keep it short — 2–4 sentences. This isn't a full "our story" page, just enough to build a face-behind-the-brand connection before the buyer commits to purchase.

## Testimonial section
- Cards in a horizontal-scroll row on mobile, 3-column grid on desktop.
- Each card: star rating row at top (Signal Red filled stars, Ink Black/outline empty stars), short quote in the middle (Space Grotesk), bottom row pairing a small circular or square product thumbnail with the buyer's name — a compact attribution block, not a full reviewer profile.
- Scroll-triggered reveal: cards fade + slide up as the section enters the viewport, staggered per card (same IntersectionObserver + CSS pattern as product grid reveal — see Animation guidelines).
- **Content dependency**: needs real customer quotes. MidRange doesn't have sales through the new site yet, so this section can't launch with genuine testimonials on day one. Treat as a Phase 2 section in practice (see PHASES.md) — launch with a small number of honest early-access/beta-tester quotes rather than empty placeholders or invented reviews.

## Store showcase section
- Instagram-style grid gallery: 3–4 columns of square-cropped photos showcasing MidRange's actual clothing/store.
- All tiles forced to the same aspect ratio via Cloudinary transforms (same approach as product photography — see Product photography), so a mix of studio and casual phone photos still reads as one curated set instead of a mismatched pile.
- Scroll-reveal on the grid — tiles fade in as they enter view, staggered.
- Optional: tapping/clicking a tile could link through to the relevant product or Instagram post (decide once you know what content you actually have).

## FAQ section
- Accordion pattern — question rows that expand to reveal an answer on tap/click.
- Implementation: prefer native HTML `<details>`/`<summary>` elements over custom JS — free keyboard accessibility and screen-reader support, no library needed, fits the site's no-animation-library approach.
- Suggested starting questions (confirm/expand with your friend): sizing, condition of thrifted items, return/exchange policy, shipping time, payment methods accepted.
- Signal Red for the expand/collapse indicator icon, Ink Black for question text, Space Grotesk for answer text.

## Footer
- Standard footer: nav links (shop, about, FAQ), policy links (returns/shipping, once written), social links (Instagram), WhatsApp contact link, copyright line.
- Sits on the darker edge of the page's vignette (bottom of page) — use Light Grey text here per the vignette contrast rule (see Background shading), not Ink Black.
- Keep it simple — this is a small single-brand store, not a multi-column mega-footer. One or two rows is enough.

## Trust cues (site-wide, beyond the homepage Trust section)
- Real photos only, consistent lighting/background style if possible.
- Visible badges on product cards: "Authentic thrift finds", "One of one", or similar honesty-forward messaging (see Component style: Badges, uses Spy Agency College).
- Return/shipping policy easily reachable (footer + product page link), not buried — see Footer and PAGES.md `/policies/returns`.
- Reviews/ratings visible on product cards once phase 2 ships — separate from, but complementary to, the homepage Testimonial section.

## Component style
- Buttons: Signal Red fill for primary CTAs (Ink Black text in most cases, since content sits in the lighter vignette center — Light Grey text only if a button happens to sit near the darkened edge), sharp or slightly rounded corners — pick one and stay consistent. Recommend sharp/minimal rounding (4–6px) for this brand.
- Product cards: image-forward, minimal text (title, price, size), tap/click to expand. Card background should be a slightly distinct grey step from the page vignette behind it (not a hardcoded white card) so cards don't break the continuous grayscale surface.
- Badges (sold, new, one-of-one): small, high-contrast, corner-positioned on product image — Signal Red background with Light Grey text, set in "Spy Agency College" for a varsity/stamp feel, reads clearly regardless of gradient position.

## Animation guidelines

**1. Scroll-triggered reveal**
- Product cards and section content fade + slide up (e.g. `opacity 0→1`, `translateY(20px)→0`) as they enter the viewport.
- Grid items stagger slightly (e.g. 60–80ms delay increment per card) rather than all firing at once — reads more intentional.
- Implementation: vanilla `IntersectionObserver` + CSS transitions, consistent with prior scroll-reveal work — no animation library.
- Trigger once per element (don't re-animate every time it scrolls back into view) — re-triggering on every scroll up/down reads as glitchy, not premium.

**2. Infinite marquee**
- Use for a horizontal scrolling ticker strip — e.g. a "NEW DROP EVERY FRIDAY · FREE SHIPPING OVER ₹999 · ONE-OF-ONE PIECES ·" style announcement band, likely placed just below the nav or as a divider between hero Part A and Part B. Set in "Spy Agency Condensed" to fit more text in a tight horizontal band. *(Confirm placement/content with your friend — assumed as an announcement strip for now.)*
- Implementation: CSS `@keyframes` translating a duplicated content track (`content content`, seamless loop) — not JS-driven scrolling, for performance.
- Pause on hover/tap (desktop hover, or tap-to-pause on mobile) so it doesn't fight users trying to read it.
- Keep speed slow and legible — a marquee that's too fast just becomes visual noise, defeats the purpose of an announcement.

**3. Parallax scrolling**
- Use sparingly — hero Part A's background blob/photo can shift at a different rate than the text as the user scrolls, and Part B's product photo can have subtle depth against the black background.
- Implementation: prefer CSS scroll-driven animations (`animation-timeline: scroll()`) where supported, falling back to a throttled `requestAnimationFrame` scroll listener — never an unthrottled scroll listener, it will jank on mobile.
- Keep parallax subtle (small offset, e.g. 10–20% speed difference) — heavy parallax on mobile is a common source of jank and battery drain.
- **Accessibility**: parallax can trigger motion sickness for vestibular-sensitive users. This is the one animation type that should be fully disabled (not just reduced) under `prefers-reduced-motion: reduce` — show the static end state instead.

**General rules (apply to all three)**
- Respect `prefers-reduced-motion` — scroll-reveal and marquee can reduce to instant/slower rather than fully disable; parallax must fully disable (see above).
- Prefer CSS transforms/opacity and IntersectionObserver over animation libraries (Framer Motion, GSAP), consistent with prior performance decisions on this stack.
- Mobile-first: build and test the mobile layout before the desktop layout, not after.

## Open decisions
- Exact Signal Red hex (needs final logo/brand colors from your friend).
- Sharp vs rounded corner system — pick one before building components.
- Whether the store has an existing logo/wordmark to build the palette around.
