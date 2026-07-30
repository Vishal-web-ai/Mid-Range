# PRD — Gen-Z Thrift Store Website

## 1. Overview
A full e-commerce website for a friend's thrift store selling Gen-Z clothing. The site must look bold, young, and trustworthy, and let the store owner (non-technical) manage the product catalog without any developer involvement.

## 2. Goals
- Give the store a real online sales channel (not just Instagram DMs).
- Let the owner add/edit/remove products independently via an admin panel.
- Build buyer trust despite being a small, unknown thrift brand.
- Ship a v1 fast, then iterate based on real usage.

## 3. Non-goals (for v1)
- Multi-vendor / multi-store support.
- Native mobile app.
- Advanced analytics or marketing automation.
- International shipping / multi-currency.

## 4. Users

### Buyer (customer)
- Gen-Z shopper, mobile-first, browsing on Instagram/WhatsApp referral.
- Wants: fast browsing, real photos, easy checkout, confidence the item is as described and will actually arrive.

### Owner (your friend)
- Non-technical, runs the store day-to-day.
- Wants: add a new item in under 2 minutes (photo, price, size, description), mark items sold, see orders come in, no code or developer dependency.

### Admin (you)
- Maintains the codebase, deploys updates, monitors for bugs.

## 5. Core user flows

**Buyer flow**
1. Land on hero → browse product grid → filter/search.
2. Open product page → view photos, size, price.
3. Add to cart → checkout → pay via Razorpay (UPI/card).
4. Receive order confirmation (email/SMS).
5. Track order status.

**Owner flow**
1. Log into `/admin`.
2. Add new product: upload photos, set price/size/category, publish.
3. Mark item as sold/out of stock.
4. View incoming orders and mark as shipped/delivered.

## 6. Functional requirements

| Area | Requirement |
|---|---|
| Catalog | Products have photos, title, description, price, size, category, condition, stock status |
| Admin | CRUD on products without touching code; image upload built in |
| Cart | Add/remove items, quantity (usually 1 for thrift/one-of-a-kind), view subtotal |
| Checkout | Razorpay integration (UPI, cards, netbanking) |
| Orders | Order record created on payment success; owner can view/update status |
| Auth | Owner login for admin; buyers can checkout as guest (no forced signup for v1) |
| Trust | Real photos only, visible return/shipping policy, reviews (phase 2) |
| Mobile | Fully responsive, mobile-first (majority of traffic will be mobile) |

## 7. Success metrics (informal, v1)
- Owner can independently list a product with zero help from you within the first week.
- At least one real, successful paid order processed end-to-end.
- Site loads and looks correct on a mid-range Android phone (most likely buyer device).

## 8. Open questions
- Shipping: does the store handle its own shipping/courier, or is it local pickup only for v1?
- Return policy specifics (window, condition) — needs input from your friend.
- Does the owner want SMS or email order notifications (or both)?
