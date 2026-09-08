# Detailed Project Report (DPR)
## Women's Saree E-Commerce Website

**Document version:** 1.0
**Last updated:** September 2026

---

## 1. Project Overview

A single-store e-commerce website for a women's-only clothing brand, currently selling sarees exclusively. The site will support a real checkout flow (not catalog-only), with regular collection updates managed by the client independently after launch. Design direction is minimalist, standard, and mobile-first.

---

## 2. Business & Client Requirements

### 2.1 Product Scope
- Category: Women's clothing — currently sarees only
- Catalog size: 50–100 products to start
- Collections updated regularly by the client post-launch
- Single store location, no multi-location logic needed
- No customization/tailoring services offered

### 2.2 Product Data Fields
- Name
- Price
- Fabric
- Images (multiple angles)
- Description
- Stock count
- Blouse piece included by default (no separate blouse variant)
- **No color field** (explicitly excluded)
- Low-stock indicator (e.g., "X left")
- Out-of-stock indicator

> Note: Product photos and names are not finalized yet. Catalog structure should be built to support empty/placeholder entries that the client fills in later.

### 2.3 Pricing & Currency
- Currency: Indian Rupee (INR)

### 2.4 Payment Methods
- Gateway: **Cashfree**
- Online-only payment methods: Cards, UPI
- **COD explicitly excluded** — decided after direct discussion with the client
- Settlement: to the client's business bank account, tied to the Cashfree account

### 2.5 Shipping & Delivery
- Ships nationally within India
- Fulfillment: **client ships products themselves** — no third-party shipping/logistics partner (e.g., Shiprocket, Delhivery) integration needed
- Delivery charge (placeholder, to be finalized later):
  - ₹150 flat delivery charge
  - Free delivery on orders above ₹7,500
- Admin panel should allow the client to manually mark orders as shipped, with an optional tracking number field

### 2.6 Customer Accounts & Features
- Authentication: Google sign-in
- Account-linked features:
  - Order history
  - Saved wishlist
  - Saved addresses

### 2.7 Customer Support
- Click-to-chat WhatsApp link (not WhatsApp Business API)

### 2.8 Pages Required
1. Home (FAQs section at the end)
2. Shop
3. About Us
4. Contact

### 2.9 Design Direction
- Minimalist, simplistic, standard design patterns (no custom design system required)
- **Mobile-first** — primary usage assumed to be mobile

### 2.10 Security & Compliance
- To be handled separately by the team; not part of this planning scope

---

## 3. Technical Decisions

### 3.1 Development & Hosting
- Development environment: Cursor
- Deployment: Vercel
- Domain: purchased and hosted on Vercel

### 3.2 Payment Integration
- Cashfree API/SDK integration for cards + UPI
- No COD order-status branch needed in order flow (online-payment-only simplifies checkout logic to: payment success → order confirmed)

### 3.3 Shipping Logic
- No shipping API/carrier integration (self-fulfilled by client)
- Checkout shipping calculation (placeholder logic):
  - If order value ≥ ₹7,500 → free shipping
  - Else → ₹150 flat shipping charge
- Rule is a placeholder; final shipping charge logic to be decided later and should be easy to update (e.g., config value, not hardcoded deep in logic)

### 3.4 Authentication
- Google OAuth sign-in for customers
- Role-based access: `role` field on user record (`customer` / `admin`)

### 3.5 Admin Panel
- Access restricted via **role-based middleware** — only the client's designated Google account has `role: admin`
- Non-admin users attempting to access `/admin/*` routes are redirected out
- Admin capabilities should include: add/edit/remove products, update stock, manage low-stock/out-of-stock indicators, view orders, mark orders as shipped (with optional tracking number)

### 3.6 Database Considerations (to be scoped next)
- Core entities: Products, Users, Orders, Wishlist, Addresses
- Product entity should support empty/placeholder states until real photos and names are added

### 3.7 SEO Technical Setup
- Server-side rendering / static generation for product and category pages (Next.js SSR/SSG)
- Dynamic meta titles & descriptions per page/product
- Open Graph + Twitter card tags
- JSON-LD structured data: `Product`, `BreadcrumbList`, `Organization` schemas
- Auto-generated XML sitemap, submitted to Google Search Console
- `robots.txt`
- Canonical URLs (avoid duplicate content from filters/sorting)
- Clean, slug-based URLs (e.g., `/shop/red-silk-saree`)
- Image optimization via Next.js `<Image>` component with mandatory descriptive alt text on every product photo
- Core Web Vitals / page speed optimization
- Mobile responsiveness (aligns with mobile-first design direction)
- Post-launch: Google Search Console + Bing Webmaster Tools setup

### 3.8 Analytics
- Google Analytics 4 (GA4) — ecommerce event tracking (product views, add-to-wishlist, checkout steps)
- Vercel Analytics — page views/performance, low-effort given existing Vercel hosting

### 3.9 Customer Support Integration
- Click-to-chat WhatsApp link embedded in the site (simple `wa.me` link, no API integration)

---

## 4. Development Approach

Database schema design and page builds are not blocked by final product names or photos. Development will proceed using placeholder/seed product data to build and test the schema, Shop page, product detail page, wishlist, cart, and checkout flow. Once the client provides final product names and photos, that data will be fed in (via Cursor) and populated into the site — no schema or page-level changes required at that point.

## 5. Open Items / To Be Decided

| Item | Status |
|---|---|
| Final shipping charge rule | Placeholder in use (₹150 flat / free above ₹7,500) — to be revisited |
| Product photos & names | Not finalized — catalog to support placeholder entries |
| Database schema (Products, Users, Orders, Wishlist, Addresses) | Not yet scoped |
| Detailed page-by-page build | Not yet started |

---

## 6. Summary

| Area | Decision |
|---|---|
| Stack | Next.js (Cursor) → Vercel |
| Payments | Cashfree — Cards & UPI only |
| Shipping | Self-managed by client; ₹150 flat / free above ₹7,500 (placeholder) |
| Auth | Google sign-in |
| Admin Access | Role-based middleware |
| Catalog | 50–100 sarees, no color field, blouse piece included |
| Design | Mobile-first, minimalist/standard |
| Support | Click-to-chat WhatsApp |
| SEO | Full technical checklist (SSR/SSG, structured data, sitemap, alt text, Core Web Vitals) |
| Analytics | GA4 + Vercel Analytics |
| Pages | Home (FAQs), Shop, About Us, Contact |
