# RR Vastras — Stitch Design Brief

A page-by-page inventory of the customer-facing website. Use this document as the source of truth when generating screens in **Stitch by Google**.

The goal is aesthetic, mobile-first frontend designs that can later be implemented on the existing Next.js storefront. **Do not invent a new product type.** The catalog is women’s sarees only. **Do not design the admin panel.**

---

## 1. Abstract

RR Vastras is an India-based women’s saree boutique. The live site is a real e-commerce store, not a catalog brochure: customers browse sarees, add them to a local cart, sign in with Google, check out with Cashfree (cards and UPI only — no COD), and manage orders, wishlist, and addresses.

The public site is SEO-friendly. Home, Shop, each Product Detail page, About, and Contact are indexable. They use unique titles, meta descriptions, canonical URLs, Open Graph tags, JSON-LD (Organization, BreadcrumbList, Product), a sitemap, and robots rules. Private commerce screens (cart, checkout, account, orders) are disallowed from crawling and should still be designed carefully — they are high-trust, high-conversion surfaces.

The brand personality is **modern Indian regality**: accessible, occasion-aware, warm, feminine, craft-led, and trustworthy. The logo (deep maroon / burgundy field, metallic gold monogram, crown, draped zari saree, tagline **“SHOP YOUR VIBE”**) is the source of truth for color and identity. Audience: women aged **20–50**.

Design for **mobile first**, then desktop. Primary language: English. Currency: **INR**. Prices include all taxes.

---

## 2. How to use this in Stitch

Generate **desktop and mobile** for every screen listed in Section 12.

For merchandising pages, also generate:

- Default / populated state
- Empty state
- Out-of-stock or filtered-empty state where noted

Keep one H1 per page. Section headings should be H2/H3. Product names on listing cards are H3, not H1.

Do not place the full ceremonial burgundy logo lockup inside the 60–72px header. Use a simplified RR monogram in the header and the full lockup on hero, about, or footer if it remains legible.

---

## 3. Brand and visual direction for Stitch

| Role | Target | Use |
| --- | --- | --- |
| Brand maroon | `#761B35` | Primary CTAs, active nav, links |
| Royal burgundy | `#430012` | Hero overlay, footer, announcement bar |
| Antique gold | `#D6B15B` | Primary CTA on dark surfaces, dividers, accents |
| Pale gold | `#F1E2B8` | Footer text, eyebrow labels on dark |
| Warm ivory | `#FCF8F2` | Page background |
| Soft blush | `#F7ECE8` | Alternate section bands, filter/empty wells |
| Ink | `#241B1C` | Headings and body |
| Warm grey | `#756A68` | Secondary copy |
| Success | `#287A50` | Confirmed / blouse included |
| Warning | `#B98935` | Low stock |
| Destructive | `#B42336` | Out of stock, errors |

Typography: elegant serif for headings (Cormorant Garamond / similar), clean humanist sans for UI and body (Manrope / similar). Headings are tracked and regal, not script novelty.

Radius: small (`4px`), not pills. Photography: editorial saree drape, fabric close-ups, occasion wear. Avoid generic fashion-template stock if better cultural imagery is available.

Tagline: **Shop Your Vibe**.

---

## 4. Business rules that affect layout

These rules must remain visible in the UI. They are not optional decoration.

- Women’s sarees only. No menswear, kids, or mixed fashion categories.
- Every saree includes a matching **blouse piece**. There is no blouse variant picker.
- There is **no color field**. Do not add color swatches.
- Product fields: name, price (INR), fabric, description, multiple images, stock count, blouse included.
- Stock badges: **Only X left** and **Out of stock**.
- Shipping: flat **₹150** across India; **free above ₹7,500**.
- Payments: Cards and UPI via Cashfree. **No Cash on Delivery.**
- Auth: Google only.
- Support: WhatsApp click-to-chat (floating button on storefront pages).
- Fulfillment: the brand ships itself; tracking number is optional and shown only when present.

---

## 5. Global chrome (appears on every storefront page)

Every customer page sits inside this shell. Design it once, then reuse.

### 5.1 Announcement bar

- Full-width, dark burgundy, gold/ivory text.
- Copy: `Free shipping over ₹7,500 · Online payments only`
- Desktop and mobile. Keep one line. Do not bury this in the footer only.

### 5.2 Header (sticky)

**Desktop (72px)**

- Left: simplified logo mark + wordmark “RR Vastras”
- Center nav: New Arrivals · Shop · Fabrics · Occasion · About
- Right: Search icon, Wishlist (heart), Account / Sign in, Cart (bag) with numeric badge

**Mobile (60px)**

- Left: hamburger
- Center: logo mark
- Right: cart with badge
- Drawer from the left (~80% width): same nav links, then Wishlist, Account or Sign in / Register, Sign out if logged in
- Overlay dims the page; body scroll locks while open

Active nav item: maroon text + underline.

### 5.3 Footer (dark burgundy, gold top border)

Four columns on desktop, stacked on mobile:

1. **Brand** — wordmark, one-sentence brand line, Instagram / Facebook / Twitter icons
2. **Shop** — New Arrivals, Silk Sarees, Cotton Sarees, Handloom Collection
3. **Support** — My Account, Track Order, Shipping Policy, Returns & Exchanges
4. **Contact** — email, phone, hours (Mon–Sat, 9:00 AM–6:00 PM)

Legal strip: copyright · Privacy Policy · Terms of Service

### 5.4 Floating WhatsApp button

- Bottom-right, circular, WhatsApp green, always visible on storefront
- Accessible label: “Chat on WhatsApp”
- Must not cover primary mobile CTAs (especially PDP add-to-cart and checkout)

### 5.5 Toast notifications

Small confirmation toasts for cart, wishlist, address saved, checkout errors. Do not design these as full-page modals.

---

## 6. SEO architecture (why pages are split this way)

Search engines should see a small, clean public graph:

| URL | Index | Role |
| --- | --- | --- |
| `/` | Yes | Brand + merchandising hub. Organization JSON-LD. Priority 1.0 |
| `/shop` | Yes | Collection page. Breadcrumb JSON-LD. Canonical `/shop`. Priority 0.9 |
| `/shop/{slug}` | Yes | Product page. Product + Breadcrumb JSON-LD, OG image. Priority 0.8 |
| `/about` | Yes | Brand story, E-E-A-T. Priority 0.5 |
| `/contact` | Yes | Support + NAP. Priority 0.5 |
| `/cart` | No | Disallowed in robots |
| `/checkout` | No | Disallowed in robots |
| `/account/*` | No | Disallowed in robots |
| `/auth/signin` | No | Utility |
| `/orders/{id}` | No | Private |
| `/admin/*` | No | Out of scope for Stitch |

Sitemap currently includes Home, Shop, About, Contact, and every published product URL.

**SEO constraints for Stitch**

- One H1 per page, matching the page purpose (not the logo).
- Hero H1 on Home can be the brand tagline; supporting copy must still say “women’s sarees”.
- Product listing titles must not steal the page H1.
- Breadcrumbs should be designed on Shop and PDP even if currently only present as JSON-LD.
- Images need real `alt` text in the design annotations (product name + fabric, not “image 1”).
- Do not hide primary product or category names inside images-only treatments with no text fallback.
- Trust copy (shipping, blouse included, pan-India, online payment) should remain crawlable text, not only icons.

**Recommended public pages not yet built** (footer already links to them; include in Stitch):

- `/shipping-policy`
- `/returns`
- `/privacy`
- `/terms`

These help trust, policy SEO, and Google Merchant / ads review. Design them as readable legal/editorial pages, not generic lorem.

---

## 7. Shared merchandising component

### Product card (used on Home, Shop, Wishlist)

Portrait image, aspect **3:4**.

Overlay badges (top-left):

- Out of stock
- Only {n} left

Below image, in this order:

1. Product name (serif, one line)
2. Fabric (muted)
3. Price in INR (e.g. `₹4,999`)

Card is a single link to `/shop/{slug}`. No add-to-cart on the card itself (current product decision). Hover: slow image zoom, name turns maroon.

Grid densities:

- Mobile: 2 columns
- Shop desktop: 3 columns
- Home / wishlist desktop: 4 columns

---

## 8. Public pages and sections

### 8.1 Home — `/`

**Purpose:** Convert a first-time visitor into a shopper. Establish brand, prove the catalog, answer buying objections.

**SEO:** Indexable. Title default: `RR Vastras | Women's Sarees`. Organization JSON-LD. H1 should be unique and keyword-aware (`Shop Your Vibe` is the brand line; nearby copy must mention sarees).

**Audience:** New visitors on mobile, aged 20–50, shopping for self or gifting.

#### Section A — Hero (full viewport, ~80vh, min 600px)

- Full-bleed editorial saree photograph with dark burgundy overlay
- Eyebrow: `New Collection` (uppercase, wide tracking, pale gold)
- H1: `Shop Your Vibe`
- Supporting paragraph: curated silk, cotton, and handloom sarees for celebrations and everyday grace
- Primary CTA: `Explore Collection` → `/shop` (gold button on dark)

Design both a cinematic desktop crop and a mobile crop that keeps the drape and the CTA above the fold.

#### Section B — Trust bar

Three equal columns on a dark band:

1. Free Shipping — on orders above ₹7,500
2. Blouse Included — with every saree purchase
3. Pan-India Delivery — shipped securely across India

This is crawlable reassurance, not a decoration strip. Keep text, not icon-only.

#### Section C — Shop by category

H2: `Shop by Category`

Three large image tiles:

| Tile | Destination intent |
| --- | --- |
| Silk Sarees | Shop filtered to silk |
| Cotton Collections | Shop filtered to cotton |
| Handloom Weaves | Shop filtered to handloom |

Desktop: 3-up. Mobile: stacked, ~400px tall. Title centered over image. Entire tile is the hit target.

#### Section D — New arrivals

H2: `New Arrivals`

- 4 latest published products as product cards
- Desktop: “View All Collection” text link top-right
- Mobile: full-width outline button under the grid
- Alternate blush/ivory background to separate from categories

#### Section E — Brand story teaser

Two columns:

- Left: heritage / craft photograph (~500px)
- Right: H2 `The RR Vastras Heritage`, gold rule, two short paragraphs, CTA `Read Our Story` → `/about`

Mobile: image then copy.

#### Section F — FAQ accordion (end of homepage)

H2: `Frequently Asked Questions`

Required questions (do not drop; they are conversion and SEO FAQ content):

1. Do your sarees include a blouse piece?
2. What are the shipping charges?
3. What payment methods do you accept?
4. How long does delivery take?
5. Can I return or exchange a saree?

Answers currently:

- Blouse piece included by default
- ₹150 flat; free above ₹7,500
- Cards and UPI via Cashfree; no COD
- Ships in 2–3 business days; delivery typically 5–7 days
- WhatsApp within 48 hours; unused, original packaging

Design as a single-open accordion. This block is a candidate for FAQPage structured data later, so keep questions as visible headings.

---

### 8.2 Shop / collection — `/shop`

**Purpose:** Browse, filter, and reach a PDP. This is the commercial landing page for “buy sarees online” intent.

**SEO:** Indexable. Title: `Shop Sarees`. Canonical `/shop`. Breadcrumb JSON-LD: Home > Shop. H1 must stay collection-level (`Shop Collection` / `Shop Sarees`), never a single product name.

Query params that change the grid (design selected/active states):

- `fabric` — silk, cotton, handloom, or any fabric in catalog
- `sort` — newest, price low–high, price high–low
- `inStock=true`

Nav also points at category-style URLs (`/shop?category=new|fabrics|occasion|silk|cotton|handloom`). Design the page so a category heading can replace the generic H1 when a collection is selected (e.g. `Silk Sarees`) while the filter sidebar remains.

#### Section A — Collection header

- Optional breadcrumb: Home / Shop
- H1
- Result count: `{n} sarees available`

#### Section B — Filters

Desktop: left sidebar (~264px).

- Sort by: Newest Arrivals, Price: Low to High, Price: High to Low
- Fabric: radio list including All fabrics + one option per fabric in catalog
- Availability: checkbox `In stock only`
- Clear all filters

Mobile: do **not** stack a long sidebar above the grid. Design a sticky “Filters / Sort” bar that opens a bottom sheet or full-screen filter panel, with apply + clear. This is a priority Stitch screen.

#### Section C — Product grid

- Mobile 2-up, desktop 3-up
- Standard product cards

#### Section D — Empty filtered state

Centered message: `No sarees match your filters. Try adjusting your selection.` plus a clear-filters action. Design this; empty catalogs will happen during launch.

---

### 8.3 Product detail (PDP) — `/shop/{slug}`

**Purpose:** Decide and add to cart. Highest-value SEO URL after Home.

**SEO:** Indexable. Dynamic `<title>` = product name. Meta description from product description. Canonical `/shop/{slug}`. Open Graph image = first product photo. JSON-LD: Product + BreadcrumbList (Home > Shop > Product). 404 if unpublished/missing.

There is no color picker and no size matrix. Do not add them.

#### Section A — Media (left on desktop, first on mobile)

- Portrait gallery, aspect 3:4
- Swipe / prev-next
- Thumbnail or pill indicators
- First image is LCP — design a real photograph, not a grey box
- Missing-image fallback: “No images available”

Desktop: gallery may stay sticky under the header.

#### Section B — Buy box (right on desktop)

Order of information:

1. Fabric label (uppercase, muted) + stock badge
2. H1 product name
3. Price in INR + `Inclusive of all taxes`
4. Divider
5. Description paragraph
6. Spec list: Fabric · Blouse (Included, with success check)
7. Quantity stepper (− / count / +) capped at stock
8. Primary CTA `Add to Cart` (full width on mobile)
9. Wishlist heart button beside or below CTA
10. Disabled CTA label when out of stock: `Out of Stock`

#### Section C — Delivery & returns card

H3: `Delivery & Returns`

- Free shipping on orders above ₹7,500
- Delivery within 5–7 business days
- 48-hour return window for unused items

#### Section D — Recommended for SEO / conversion (design even if not coded yet)

Add these as optional lower sections so Stitch output is launch-ready:

- Breadcrumb row
- Sticky mobile purchase bar (price + Add to Cart) that does not collide with WhatsApp
- “You may also like” — 4 related sarees
- Fabric care / how to drape (short editorial, good for long-form SEO)

Generate two PDP variants: **in stock** and **out of stock**.

---

### 8.4 About — `/about`

**Purpose:** Trust, story, women’s-only positioning. Supports branded search and About-this-brand rich results.

**SEO:** Indexable. Title: `About Us`. H1: `Our Story`. Keep body copy as real text, not only overlay on a photo.

#### Sections

1. **Page header** — H1, gold rule
2. **Editorial image** — wide saree / craft photograph, ~400px
3. **Lead paragraph** — centered, stronger type: women’s clothing brand dedicated to the saree; tradition with modern sensibility
4. **Body** — blouse piece included; silks, cottons, handloom; based in India; nationwide shipping; personal packing; first collection or occasion piece

Optional Stitch additions (recommended):

- Founder / atelier note
- “Who we design for” (women 20–50)
- Values row: craft, comfort, honest stock, pan-India shipping
- CTA to Shop

---

### 8.5 Contact — `/contact`

**Purpose:** Convert questions to WhatsApp or account support. Local/business trust.

**SEO:** Indexable. Title: `Contact`. H1: `Contact Us`. Include visible email/phone/hours somewhere on the page (currently in footer; repeating them here is better for NAP consistency).

#### Sections

1. **Header** — H1, gold rule, intro: questions about an order, a saree, or shipping
2. **WhatsApp card** — icon, H2 WhatsApp, supporting copy, primary CTA `Chat on WhatsApp`
3. **Order support card** — H2 Order Support, copy pointing to signed-in order history, outline CTA `Go to Account`
4. **Shipping information band** — full width: pan-India, ₹150, free above ₹7,500

Optional Stitch additions:

- Repeat email `support@rrvastras.com`, phone, hours
- Map is **not** required (single online store, no storefront visit flow)

Do not add a long contact form as the primary path. WhatsApp is the support channel.

---

## 9. Commerce pages (noindex, still design them)

These pages drive revenue. Stitch should treat them as premium, calm, and trustworthy — not afterthoughts.

### 9.1 Cart — `/cart`

**Auth:** Not required. Cart is `localStorage`.

#### Empty state

- H1: `Your Shopping Bag`
- Copy: bag is empty
- CTA: `Continue Shopping` → `/shop`

#### Populated state

- H1: `Your Bag ({count} items)`
- **Line items (left, 2/3 width on desktop):** thumbnail 3:4, name, unit price, line total, quantity stepper, Remove
- **Summary (right, sticky):** H2 Order Summary, subtotal, shipping “Calculated at checkout”, total, tax note, primary CTA `Proceed to Checkout`

Mobile: items stacked, summary below, sticky checkout button acceptable.

---

### 9.2 Checkout — `/checkout`

**Auth:** Required. Unauthenticated users go to Sign in with `callbackUrl=/checkout`.

**Empty cart:** same empty treatment as cart, CTA Shop Now.

#### Populated checkout

H1: `Checkout`

**Left — Delivery address**

- Radio cards of saved addresses (name, lines, city, state, pincode, phone)
- Selected card: maroon border + light maroon fill
- `Add new address` reveals a form: Full Name, Phone, Address Line 1, Line 2 optional, City, State, Pincode (6 digits)
- Save / Cancel

**Right — Order summary (sticky)**

- Line items with quantities
- Subtotal, Shipping (Free or ₹150), Total
- Primary CTA: `Pay with Cashfree`
- Microcopy + lock icon: `Secure payment via Cards & UPI`
- Loading label on CTA: `Processing...`

Design an error toast/banner for failed checkout, and a “select an address” validation state. Do not invent COD, coupons, or gift-wrap unless asked later.

---

### 9.3 Sign in — `/auth/signin`

Centered, narrow column.

- H1: `Sign in to RR Vastras`
- Copy: Google account unlocks orders, wishlist, saved addresses
- Single CTA: `Continue with Google`
- No email/password fields

This page should feel on-brand (ivory, serif heading, maroon button), not like a generic OAuth stub.

---

### 9.4 Account home — `/account`

**Auth:** Required.

#### Sections

1. Header — H1 `My Account`, welcome line with name/email
2. **Three destination cards** — Orders, Wishlist, Addresses (title + one-line description)
3. **Recent orders** — last 5, or empty well with `Start Shopping`
4. Each order row: order number, placed-on date, status badge, total → `/orders/{id}`
5. `View all` → `/account/orders`

Status badges: pending payment, confirmed, shipped, cancelled.

---

### 9.5 Order history — `/account/orders`

- Back link to Account
- H1: `Order History`
- Empty: `No orders yet.`
- List of order cards: number, date, status, item names × qty, total
- Entire card links to order detail

---

### 9.6 Order detail / confirmation — `/orders/{id}`

Private. Also used as the post-payment success landing (`?payment=success`).

#### Sections

1. **Success banner** (only when payment succeeded and status is confirmed): `Payment successful!` + thank-you / we’ll ship soon
2. Header: H1 `Order {orderNumber}`, placed-on date, status badge
3. **Items card** — lines, then subtotal, shipping, total
4. **Delivery address card** — snapshot of the address used (not a live editable address)
5. **Tracking card** — only if `trackingNumber` exists
6. Actions: `All Orders`, `Continue Shopping`

Design with and without the success banner, and with/without tracking.

---

### 9.7 Wishlist — `/account/wishlist`

- Back link, H1 `My Wishlist`
- Empty: copy + `Browse sarees`
- Populated: same product-card grid as Home (2 / 4 columns)

---

### 9.8 Addresses — `/account/addresses`

- Back link, H1 `Saved Addresses`
- List of address cards; Default labelled
- H2 `Add New Address` + the same address form fields as checkout

---

### 9.9 404 — not found

- Centered
- Large `404`
- Short explanation
- CTA `Go Home`

Keep it on-brand. Do not use clip-art or jokes.

---

## 10. Policy pages to design (linked, not yet implemented)

These are public, indexable, and important for SEO + checkout trust. Use H1 matching the page name, short intro, scannable H2s, last-updated line.

### `/shipping-policy`

Cover: pan-India only, ₹150 flat, free over ₹7,500, 2–3 day dispatch, 5–7 day delivery, no third-party live tracking widget, optional tracking number after ship, WhatsApp for delays.

### `/returns`

Cover: 48-hour WhatsApp window, unused + original packaging, blouse piece must be included, no reason-code form required in v1.

### `/privacy`

Cover: Google sign-in data, orders, addresses, cookies/analytics (GA4 + Vercel Analytics), payments processed by Cashfree (no card data stored on RR Vastras).

### `/terms`

Cover: online-only sale of sarees, no COD, stock accuracy, Indian jurisdiction placeholder.

Keep language plain. Women 20–50 will actually read these on mobile before paying.

---

## 11. Out of scope for Stitch

Do not generate screens for:

- Admin dashboard, product CRUD, order ship form, store settings
- API routes, webhooks, Cashfree SDK overlay (use a “redirecting to secure payment” interstitial if needed)
- Email templates (unless requested later)

---

## 12. Recommended Stitch screen list

Generate **desktop + mobile** unless noted.

### Priority 1 — brand and conversion

1. Home (populated)
2. Shop — filters open (desktop sidebar / mobile sheet)
3. Shop — populated grid
4. Shop — empty filters
5. PDP — in stock
6. PDP — out of stock
7. PDP — mobile with sticky buy bar
8. Cart — populated
9. Cart — empty
10. Checkout — saved address selected
11. Checkout — add-address form open

### Priority 2 — trust and SEO content

12. About
13. Contact
14. Shipping Policy
15. Returns & Exchanges
16. Sign in
17. 404

### Priority 3 — logged-in account

18. Account home — with recent orders
19. Account home — no orders
20. Order history
21. Order detail — payment success
22. Order detail — shipped with tracking
23. Wishlist — populated and empty
24. Addresses

### Global components to export alongside pages

25. Header + announcement (desktop)
26. Header + mobile drawer
27. Footer
28. Product card (in stock, low stock, out of stock)
29. WhatsApp button in context of PDP and checkout (clearance from CTAs)

---

## 13. Copy bank Stitch can place on screens

Use this exact product voice. Do not switch to generic “fashion store” lorem.

**Brand line:** Shop Your Vibe  
**Hero support:** Discover curated sarees in silk, cotton, and handloom weaves. Crafted for celebrations, everyday grace, and everything in between.  
**Announcement:** Free shipping over ₹7,500 · Online payments only  
**Trust:** Free Shipping · Blouse Included · Pan-India Delivery  
**Primary shop CTA:** Explore Collection / Continue Shopping / Add to Cart / Pay with Cashfree  
**Payment microcopy:** Secure payment via Cards & UPI  
**Empty cart:** Your bag is currently empty.  
**Out of stock:** Out of Stock  
**Low stock:** Only {n} left  

Sample product names if placeholders are needed: Banarasi Silk Saree, Handloom Cotton Saree, Kanjivaram Silk Saree, Chanderi Tissue Saree. Always show a fabric subtitle and an INR price.

---

## 14. Implementation note for later

This brief describes the **customer information architecture** the site should present. Some footer/policy routes and mobile filter sheets are designed ahead of code. When screens come back from Stitch, implement them on the existing Next.js routes without changing APIs, Prisma models, Cashfree checkout, or Auth.js unless a layout truly requires it.

**Admin** remains a separate internal tool and is not part of this Stitch pass.
