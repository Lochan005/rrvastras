# RR Vastras UI/UX Implementation Specification

Evidence-based storefront audit for a women's saree business targeting customers aged 20–50.

## 1. Core diagnosis

The commerce foundation is usable, but the storefront currently reads as a generic Next.js catalogue.

The supplied logo promises ceremonial Indian luxury through deep burgundy, antique gold, intricate craft, and a regal silhouette. The current UI instead uses a pale template-like surface, system typography, a text-only hero, and no production logo treatment.

Product photography is also failing in the supplied screenshots, removing the strongest sales signal.

## 2. Recommended creative direction

### Modern Indian regality

Position RR Vastras as:

- Accessible
- Confident
- Occasion-aware
- Regal
- Warm
- Feminine
- Craft-led
- Trustworthy
- Contemporary

Use the logo's ceremonial richness as punctuation, balanced with generous ivory space, modern product photography, and plain-language shopping guidance.

The age range 20–50 requires:

- Editorial aspiration for younger shoppers
- Clarity, trust, and legibility for mature shoppers

Avoid:

- Generic minimalism
- Wedding-only positioning
- Gaudy or excessive gold
- Ornate interface controls
- Cold monochrome layouts
- Tiny fashion typography
- Low-contrast gold body copy
- Novelty script fonts
- Ultra-youthful language

## 3. Current frontend architecture

### Rendering and routes

- Next.js App Router with a `(storefront)` route group and a separate admin layout
- Server Components query Prisma directly
- Cart, filters, gallery, authentication, and forms use isolated Client Components
- The storefront layout currently uses `force-dynamic`, protecting database-backed rendering but removing static-generation benefits from otherwise static pages

Reference: `src/app/(storefront)/layout.tsx`

### State and providers

- Authentication, toast, and cart providers are correctly centralized in the root layout
- Cart persistence uses `localStorage`
- Wishlist, addresses, accounts, products, and orders are database-backed
- This is an appropriate MVP split
- Loading, error, and optimistic states need a unified pattern

Reference: `src/app/layout.tsx`

### Design layer

- Tailwind CSS v4 tokens
- Small Radix-backed component collection
- Embla carousel for the product gallery
- Existing primitive APIs are useful
- Current tokens are too shallow: one system font, limited color roles, and no defined typography, spacing, radius, or motion scales
- Storefront and admin currently share a generic visual language

Reference: `src/app/globals.css`

## 4. What should be retained

- Next.js routing and provider architecture
- Prisma-backed product and stock model
- Server-rendered product data
- Radix accessibility foundations
- Embla product gallery
- Two-column mobile product grid
- Stock indicators
- Blouse-piece inclusion information
- WhatsApp support
- INR formatting
- Cart mechanics
- Account and order flows

## 5. What should be rebuilt or substantially restyled

- Global visual tokens
- Typography
- Header and logo treatment
- Mobile navigation
- Text-only homepage hero
- Homepage merchandising hierarchy
- Product card composition
- Product imagery
- Product-listing mobile filters
- Product-listing desktop density
- PDP information architecture
- Mobile PDP purchase bar
- Footer
- About page
- Contact page
- Loading, error, empty, and broken-image states

## 6. Logo and visual language

The supplied logo combines:

- Crowned RR monogram
- Draped saree
- Filigree ornament
- Wide-tracked wordmark
- Burgundy field
- Metallic gold detailing

It communicates:

- Premium occasion wear
- Heritage craft
- Feminine ceremony
- Traditional richness

The current header replaces the identity with plain text, so users do not receive the same brand promise.

### Required logo assets

Prepare three production logo families:

1. Full ceremonial lockup for campaigns, packaging, footer, and appropriate hero use
2. Simplified RR monogram for the header, favicon, and social avatar
3. One-color burgundy, ivory, and gold variants

Use transparent SVG or WebP exports.

Do not put the supplied full rectangular burgundy logo image directly into the 60–72px site header. It is too detailed to remain legible at that size.

## 7. Color system

These values are visual implementation targets derived from the supplied logo. Confirm them against the original logo source if available.

| Token | Target | Usage | Pair with |
|---|---:|---|---|
| Royal burgundy | `#430012` | Logo field, dark footer, selected navigation | White or ivory |
| Brand maroon | `#761B35` | Primary buttons, links, active controls | White |
| Ruby accent | `#A82B4F` | Small highlights, editorial accents | White for large text only |
| Antique gold | `#D6B15B` | Rules, icons, ornamental details, premium labels | Decorative on light surfaces |
| Pale gold | `#F1E2B8` | Premium backgrounds and chips | Ink or burgundy |
| Warm ivory | `#FCF8F2` | Primary page background | Ink or burgundy |
| Soft blush | `#F7ECE8` | Alternate sections and selected states | Ink or burgundy |
| Warm ink | `#241B1C` | Body copy and headings | Ivory or white |
| Stone | `#756A68` | Secondary copy and metadata | Ivory or white |

### Usage rules

- Burgundy is the primary action color
- Gold should occupy less than approximately 10% of a page
- Gold should not carry small text on ivory or white
- Product imagery should receive more visual emphasis than brand decoration
- Do not make every section burgundy and gold

## 8. Typography

Replace Segoe UI with a controlled two-family system.

### Recommended families

- Display and headings: **Cormorant Garamond**
- Body and UI: **Manrope**
- Display fallback: `Georgia, serif`
- UI fallback: `Arial, sans-serif`

Cormorant Garamond provides editorial and heritage character without copying the decorative logo lettering. Manrope keeps navigation, pricing, forms, and longer copy legible for the full audience.

| Role | Family and weight | Usage | Size / line-height |
|---|---|---|---|
| Display | Cormorant Garamond 600 | Hero and editorial headings | 40/44 mobile; 64/68 desktop |
| H1 | Cormorant Garamond 600 | Page title | 32/36 mobile; 40/44 desktop |
| H2 | Cormorant Garamond 600 | Section title | 26/32 mobile; 30/36 desktop |
| H3 | Cormorant Garamond 600 | Subsection title | 22/28 |
| Body | Manrope 400 | Main copy | 16/26 |
| Body large | Manrope 400 | Introductory copy | 18/29 |
| UI | Manrope 500–600 | Navigation, forms, buttons | 14/20 |
| Micro | Manrope 500–600 | Eyebrows, badges, metadata | 12/16 |
| Price | Manrope 600 | Cards, PDP, totals | 16/22 card; 26/32 PDP |

### Typography rules

- Never use the decorative logo face for body copy
- Keep body copy at least 16px on mobile
- Keep product metadata at 13–14px
- Reserve uppercase tracking for short eyebrow labels
- Do not use letter-spaced uppercase for long text

## 9. Spacing, shape, and layout

### Spacing scale

Use:

`4, 8, 12, 16, 24, 32, 48, 64, 96`

### Section spacing

- Mobile: 56–72px
- Tablet: approximately 64px
- Desktop: 88–112px

### Containers

- Mobile gutters: 16px
- Tablet gutters: 24px
- Desktop gutters: 32px
- Main storefront maximum width: 1240–1280px
- Reading-content maximum width: 680–720px

### Shape

- Product media radius: 2–4px
- Buttons and inputs: 4px
- Utility panels: 8px
- Avoid pervasive rounded cards
- Avoid excessive shadows
- Product cards should normally use imagery and spacing instead of bordered white containers

## 10. Imagery specification

Photography is part of the product information, not decoration.

### Hero

- Mobile crop: 3:4
- Desktop art direction: approximately 16:9
- Show one woman wearing a complete drape
- Use a calm, confident pose
- Use an uncluttered architectural or warm studio setting
- Leave copy-safe negative space

### Product primary image

- Aspect ratio: 4:5
- Minimum size: 1600×2000
- Full front drape
- Consistent distance and background
- Accurate fabric color
- Border and pallu clearly visible

### Product-detail imagery

Include:

- Pallu
- Border or zari
- Fabric texture
- Blouse piece
- Back or side drape
- Scale reference

Use 4:5 portrait or square crops where appropriate.

### Collection imagery

Create occasion-led imagery for:

- Wedding and occasion
- Festive
- Work and everyday
- Contemporary

### Brand-story imagery

Use:

- Hands
- Weaving
- Fabric folds
- Packing
- Curation
- Real process

Avoid generic stock photography.

### Current imagery problem

The seed data reuses three Unsplash URLs across nine products. The screenshots show broken images with raw alt text over pale blocks.

This is a launch blocker.

Reference: `prisma/seed.ts`

## 11. Homepage hierarchy

### 1. Announcement bar

- Height: 32–36px
- Example: “Free shipping over ₹7,500 · Online payments only”
- Show one message at a time on mobile

### 2. Primary header

- Monogram or horizontal logo
- Shop
- New arrivals
- Fabrics
- Occasion
- About
- Search
- Wishlist
- Account
- Bag

Target height:

- Desktop: 72px
- Mobile: 60px

### 3. Editorial hero

- Product-led campaign image
- One editorial heading
- Supporting copy limited to two lines where possible
- Primary CTA: “Shop new arrivals”
- Secondary CTA: “Shop by fabric”
- Desktop height: 70–80vh
- Mobile height: 62–70vh

### 4. Shop by need

Four visual paths:

- Wedding and occasion
- Festive
- Work and everyday
- Contemporary

These can initially use query links until a formal collection model exists.

### 5. New arrivals

- 8–12 products
- Four columns on desktop
- Two columns on mobile

### 6. Brand or editorial story

- Image with concise brand story
- Mention curated drapes
- Mention blouse-piece inclusion
- Mention India-wide fulfilment
- Link to About

### 7. Shop by fabric

- Silk
- Banarasi
- Cotton
- Organza
- Linen

Use compact image tiles or chips instead of repeating the same product-grid presentation.

### 8. Trust strip

- Blouse included
- Secure Cashfree payment
- Pan-India delivery
- WhatsApp support

Use a simple icon and one line of copy for each item.

### 9. Social proof

Only show testimonials, ratings, or customer imagery when authentic content exists.

Do not add fake reviews or placeholder social proof.

### 10. FAQ and footer

- Retain the accessible FAQ accordion
- Move secondary policy and support information into a branded dark footer

### Current homepage issue

The current text-only hero, featured grid, benefits, and FAQ are understandable but interchangeable with a generic template.

The hero needs a saree and a wearer. Occasion and fabric discovery should appear before operational benefits.

Reference: `src/app/(storefront)/page.tsx`

## 12. Product listing page

### Desktop

- Breadcrumb
- H1
- Concise collection description
- 240px sticky filter rail
- Three product columns from approximately 768–1099px
- Four product columns from approximately 1100px
- Result count and sort control in one toolbar
- Filter groups use checkboxes and disclosure sections instead of only native selects
- Active filters appear as removable chips
- Provide “Clear all”

### Mobile

- Sticky toolbar with equal Filter and Sort buttons
- Filter opens a Vaul bottom sheet
- Apply button shows the number of matching results
- Preserve two-column product grid
- 12px card gap
- 14px legible product titles
- Active filters appear in a horizontally scrollable chip row
- Restore scroll position when returning from PDP

## 13. Product card specification

### Composition

1. 4:5 product media with 2–4px radius and stable dimensions
2. Wishlist control at top-right
3. Minimum mobile hit target of 44×44px
4. Only one compact badge: New, Low stock, or Sold out
5. Product name limited to two lines
6. Fabric or collection as secondary metadata
7. Price on its own row
8. Compare-at price and discount only when real
9. Optional desktop quick add

### Behavior

- Product information area links to PDP
- Wishlist remains independently operable and accessible
- Sold-out imagery receives a subtle veil
- Avoid loud destructive red for normal stock messaging
- Image hover zoom should be limited to approximately 1.02–1.03
- Respect `prefers-reduced-motion`
- Product card has no unnecessary border, white panel, or shadow
- Loading skeleton must match final image and text geometry
- Mobile must never rely on hover

### Analytics

Track:

- `view_item_list`
- `select_item`
- `add_to_wishlist`
- Quick add

Reference: `src/components/storefront/product-card.tsx`

## 14. Product detail page

### Gallery

Desktop:

- 58–62% of page width
- Use a two-column media grid when four or more images exist
- Otherwise use a large main image with thumbnails

Mobile:

- Full-width or full-bleed 4:5 swipe carousel
- Image counter
- Optional tap-to-zoom

### Purchase panel

Desktop:

- Sticky within the viewport
- Maximum width approximately 420px

Mobile:

- Normal content flow
- Fixed bottom purchase bar after the main media area

### Product identity

Display:

- Visible breadcrumb
- Fabric or collection eyebrow
- Product name
- Price
- Tax and shipping note
- Stock state

On mobile, keep the product name to approximately two or three lines and place price and stock directly below it.

### Decision facts

Show before the long description:

- Fabric
- Blouse piece included
- Weave or work
- Saree length, if available
- Care instructions
- Dispatch estimate

### CTA

- Quantity selector
- Full-width Add to Bag
- Wishlist as secondary icon action
- Explain disabled stock state
- Primary button height: 48–52px
- Respect mobile safe-area padding
- Do not allow WhatsApp to overlap the purchase bar

### Delivery information

- Pincode input
- Estimated dispatch
- Estimated delivery
- Shipping threshold message
- May be collapsible on mobile but must appear before long description

### Confidence content

- Secure payment
- Pan-India shipping
- Return or exchange policy
- WhatsApp support

### Lower PDP content

- Description
- Details accordion
- Care accordion
- Related sarees
- Recently viewed

The current PDP contains the correct minimum data, but it reads like a database record. It lacks visible breadcrumbs, delivery assurance, structured details, related discovery, and a mobile sticky purchase action.

Reference: `src/app/(storefront)/shop/[slug]/page.tsx`

## 15. Navigation

### Desktop

Structure:

1. Announcement bar
2. 72px primary header
3. Left: RR monogram and wordmark
4. Center: New Arrivals, Shop, Fabrics, Occasion, About
5. Right: Search, Wishlist, Account, Bag with item count

Rules:

- Current route uses an underline or burgundy text
- Add `aria-current`
- Do not use pill-shaped navigation items
- Search opens a focused product-search overlay with suggestions
- All icon controls have at least 44×44px hit targets

### Mobile

Header:

- Height: 60px
- Menu
- Centered monogram
- Search
- Bag

Menu:

- Full-height drawer
- New Arrivals
- Shop all
- Shop by Fabric
- Shop by Occasion
- About
- Account or Sign in
- WhatsApp

Behavior:

- Lock body scroll
- Trap keyboard focus
- Keep a visible close control

The current inline menu expansion is functional but causes page reflow and lacks a branded navigation hierarchy.

Reference: `src/components/storefront/header.tsx`

## 16. Mobile experience

### Global requirements

- Minimum target size: 44×44px
- Primary commerce controls: 48–52px
- Mobile gutters: 16px
- Two-column product grid
- Drawer-based navigation
- Bottom-sheet filters
- Sticky PDP purchase bar
- Safe-area support
- No collision between WhatsApp, toast, filter, and purchase controls

### Current mobile risks

- Admin navigation disappears below the `md` breakpoint
- Shop filters stack above products instead of opening in a drawer
- Cart line-item layout can become cramped
- Checkout city/state fields remain two columns on very small screens
- Quantity selector and Add to Cart can wrap awkwardly
- Cart count can briefly show zero during hydration
- Product-gallery arrow targets are only approximately 40px
- WhatsApp is positioned on the left and can collide with content

### Suggested test widths

- 320px
- 375px
- 430px
- 768px
- 1024px
- 1440px

## 17. Cart, checkout, and content pages

### Cart

Desktop:

- Two-thirds line items
- One-third sticky summary

Mobile:

- Single column
- Clear item hierarchy
- Full-width checkout action

Add free-shipping progress messaging above totals.

### Checkout

- Retain two-column address and summary structure on desktop
- Add a simple step indicator
- Add inline validation and persistent error messages
- Add payment trust copy
- Add a persistent mobile total and Pay CTA
- City/state fields should stack on narrow mobile screens

### About

- Add genuine brand and process imagery
- Use an editorial image-and-copy composition
- Explain curation and product philosophy
- Avoid a single long text block

### Contact

- Keep WhatsApp as the primary support channel
- Replace repeated generic cards with a clearer contact and support hierarchy
- Show order-support guidance and shipping details consistently

### Footer

- Use the approved logo lockup
- Use a royal-burgundy field
- Include shopping, support, account, and brand links
- Include payment and fulfilment trust information
- Keep gold decorative and ensure all text has accessible contrast

## 18. Existing component disposition

| Component | Decision | Specification |
|---|---|---|
| Root providers | Retain | Authentication, toast, and cart providers are correctly centralized |
| Storefront route group | Retain; revise rendering | Keep storefront/admin separation; narrow `force-dynamic` scope |
| Button | Restyle | Keep API and variants; revise height, radius, typography, and focus |
| Input / Label | Restyle | Keep APIs; increase mobile height and add help/error states |
| Badge | Restyle | Keep stock semantics; make labels less SaaS-like |
| Accordion | Retain and restyle | Keep Radix accessibility; improve rhythm and target size |
| ProductCard | Rebuild composition | Preserve data contract; rebuild presentation |
| ProductGallery | Extend | Keep Embla; add thumbnails, zoom, counter, and swipe affordance |
| Header | Rebuild | Preserve auth/cart behavior; add logo, discovery, search, and drawer |
| Footer | Rebuild | Add brand identity and richer trust/support hierarchy |
| ShopFilters | Rebuild responsive behavior | Retain desktop rail; use mobile bottom sheet and chips |
| WhatsApp CTA | Retain with adjustment | Move to bottom-right and prevent mobile collisions |

## 19. Implementation inconsistencies affecting UX

### Dynamic settings with static marketing copy

Problem:

Admin can change shipping values while Home, Contact, and Footer continue showing hardcoded ₹150 and ₹7,500 values.

Resolution:

Create one shared `ShippingMessage` component backed by `StoreSettings`.

### Duplicated address forms

Problem:

Checkout and Account can drift in validation, labels, and errors.

Resolution:

Extract one `AddressForm` with create and select modes plus a shared validation schema.

### Duplicated quantity steppers

Problem:

Cart and PDP have slightly different raw-button behavior and target sizing.

Resolution:

Create an accessible `QuantityStepper` with stock limits and 44px targets.

### Duplicated order-status mapping

Problem:

The same status can receive inconsistent text or color across multiple pages.

Resolution:

Create `OrderStatusBadge` and centralize status labels.

### Missing loading and error boundaries

Problem:

Database and network delays can produce abrupt transitions or generic framework errors.

Resolution:

Add route-level `loading.tsx`, `error.tsx`, and shared skeleton/error states.

### Missing navigation active state

Problem:

Users cannot reliably identify their current section.

Resolution:

Add pathname-aware state with `aria-current`, underline, and color treatment.

### Admin navigation hidden on mobile

Problem:

Admin navigation is unavailable below the medium breakpoint.

Resolution:

Add an admin drawer or compact mobile navigation.

### Wishlist state not hydrated on PDP

Problem:

A saved product still renders as an empty heart initially.

Resolution:

Query membership server-side and pass `initialInWishlist`.

### Misleading toast ownership

Problem:

`ToastProvider` renders messages while `Toaster` returns nothing.

Resolution:

Use one clearly owned toast viewport with `aria-live`.

### Entire storefront forced dynamic

Problem:

Static pages lose caching and SSG benefits.

Resolution:

Move database-dependent settings to narrower boundaries and restore static rendering where appropriate.

### No visible breadcrumbs

Problem:

Breadcrumb JSON-LD helps search engines but not shoppers.

Resolution:

Render accessible breadcrumbs on PLP, PDP, account, and order-detail pages.

### Inconsistent containers and empty states

Problem:

Account widths and no-data screens appear to come from different templates.

Resolution:

Create `Container`, `PageHeader`, and `EmptyState` primitives with named variants.

### Root 404 outside storefront shell

Problem:

A missing product can lose storefront navigation and recovery context.

Resolution:

Provide a storefront-scoped not-found screen with search and shop recommendations.

## 20. New reusable storefront components

| Component | Responsibility |
|---|---|
| `BrandLogo` | Full and monogram variants, dark/light treatment, responsive accessible label |
| `AnnouncementBar` | Configurable one-line store message |
| `Container` | Standard widths and responsive gutters |
| `Section` | Standard section spacing |
| `SectionHeading` | Eyebrow, title, copy, and optional trailing link |
| `EditorialHero` | Art-directed image, copy position, overlay contrast, and CTAs |
| `CollectionTile` | Occasion or fabric image tile |
| `TrustItem` | Icon, title, and proof point |
| `TrustStrip` | Responsive collection of trust items |
| `ProductCardSkeleton` | CLS-safe loading state |
| `FilterSheet` | Mobile filter flow |
| `ActiveFilterChips` | Visible removable filter state |
| `Price` | INR, compare-at price, and discount semantics |
| `StockMessage` | In-stock, low-stock, and sold-out treatment |
| `DeliveryEstimator` | Pincode, shipping threshold, and delivery estimate |
| `ProductFacts` | Fabric, blouse, care, and product facts |
| `MobilePurchaseBar` | PDP price and Add to Bag with safe-area support |
| `EmptyState` | Cart, wishlist, orders, and search empty states |
| `QuantityStepper` | Shared accessible quantity control |
| `OrderStatusBadge` | Shared status wording and presentation |
| `ShippingMessage` | Dynamic shipping threshold messaging |

## 21. Interaction and accessibility rules

- Minimum touch target: 44×44px
- Primary commerce controls: 48–52px
- Keyboard focus: visible 2px outline with 2px offset
- Do not communicate state through color alone
- Meet WCAG AA contrast for body and UI copy
- Use antique gold decoratively unless placed accessibly on burgundy
- Control transitions: 150–220ms
- Drawer transitions: 250–350ms
- Honor `prefers-reduced-motion`
- Product alt text should describe fabric, dominant visible tone, border/work, and view
- Do not use marketing copy as image alt text
- Toasts need `aria-live`
- Forms need persistent labels and inline errors
- Product queries need geometry-matched skeletons
- Broken images must use a branded fallback rather than exposing raw alt text

## 22. Implementation sequence

### Phase 1 — Brand foundation

- Prepare logo variants
- Load fonts with `next/font`
- Expand color, type, spacing, radius, and motion tokens

Output: approved brand foundation and token sheet.

### Phase 2 — Shell

- Announcement bar
- Header
- Mobile drawer
- Search entry
- Footer
- WhatsApp positioning

Output: consistent responsive navigation across routes.

### Phase 3 — Commerce primitives

- Restyle button, input, badge, accordion, and toast
- Build Container, Section, Price, StockMessage, Trust, EmptyState, and shared form controls

Output: reusable accessible component foundation.

### Phase 4 — Photography pipeline

- Replace broken seed URLs
- Define admin crop and alt requirements
- Add placeholders
- Add product skeletons

Output: no broken media and a consistent 4:5 catalogue.

### Phase 5 — Homepage

- Editorial hero
- Occasion discovery
- New arrivals
- Brand story
- Fabric navigation
- Trust strip
- FAQ

Output: brand-led merchandising homepage.

### Phase 6 — Product listing

- Rebuild product cards
- Responsive grid
- Active chips
- Mobile filter sheet
- Sort interaction

Output: fast browse and filtering experience.

### Phase 7 — Product detail

- Extend gallery
- Sticky purchase panel
- Product facts
- Delivery estimator
- Trust content
- Detail accordions
- Related products
- Mobile purchase bar

Output: decision-complete PDP.

### Phase 8 — Cart, checkout, and account

- Improve summaries
- Add dynamic free-shipping messaging
- Add validation
- Add checkout steps
- Normalize empty, loading, and error states

Output: coherent purchase and account flow.

### Phase 9 — QA

Test:

- 320, 375, 430, 768, 1024, and 1440px widths
- Keyboard navigation
- Screen-reader flow
- Reduced motion
- Image performance
- Layout shift
- Analytics

Output: release checklist passed.

## 23. Acceptance criteria

### Brand

- Header uses an approved production logo
- Burgundy, gold, and ivory tokens are consistent
- Gold is not used as inaccessible body text

### Typography

- Display and UI fonts load through `next/font`
- Segoe UI is not visible in normal conditions

### Imagery

- No broken product images
- Every published product has at least one 4:5 image
- Every image has useful alt text

### Homepage

- Hero communicates product, occasion, and CTA above the fold
- Category and new-arrival discovery follow the hero

### Product listing

- Filter and sort remain reachable on mobile
- Selected filters are visible
- Cards remain legible in two columns at 320px

### PDP

- Price, fabric, blouse inclusion, stock, delivery estimate, and purchase CTA are easy to find
- Mobile has a sticky purchase action

### Mobile

- Controls are at least 44×44px
- Primary actions are 48–52px high
- Floating controls do not overlap

### Accessibility

- WCAG AA contrast
- Visible keyboard focus
- Semantic heading order
- Useful image alt text
- Reduced-motion support

### Performance

- LCP hero is optimized
- Product images use correct responsive sizes
- Media and sticky controls do not create layout shift

## 24. Priority order

### P0 — Blocks a credible storefront

- Fix product imagery
- Create usable logo variants
- Establish typography and visual tokens
- Rebuild header
- Rebuild product cards

### P1 — Drives discovery and conversion

- Recompose homepage
- Implement responsive PLP filters
- Complete PDP decision and purchase hierarchy

### P2 — Polish and retention

- Editorial About and Contact pages
- Related products
- Recently viewed
- Authentic reviews or customer imagery
- Richer account states

## 25. Non-goals

- Do not redesign backend order and payment logic as part of the UI pass
- Do not add color variants
- Do not add COD
- Do not add tailoring
- Do not add fake reviews
- Do not add placeholder social proof
- Do not turn every surface burgundy and gold
- Do not repeat the crown or ornamental motif throughout the interface

