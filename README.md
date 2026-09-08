# RR Vastras

Women's saree e-commerce store built with Next.js, Prisma, Google Auth, and Cashfree payments.

## Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Database:** PostgreSQL (Neon) + Prisma
- **Auth:** Auth.js (NextAuth) with Google OAuth
- **Payments:** Cashfree (Cards & UPI)
- **Storage:** Vercel Blob (product images)
- **Hosting:** Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `AUTH_SECRET` — random secret (`openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
- `ADMIN_EMAIL` — Google account that receives admin role
- `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY` — Cashfree credentials (optional for dev; mock checkout used when unset)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token (optional; falls back to data URLs in dev)

### 3. Set up database

```bash
npm run db:push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|---|---|
| `/` | Home with featured sarees and FAQs |
| `/shop` | Product catalog with filters |
| `/shop/[slug]` | Product detail page |
| `/about` | About Us |
| `/contact` | Contact + WhatsApp |
| `/cart` | Shopping cart |
| `/checkout` | Checkout (auth required) |
| `/account` | User dashboard |
| `/admin` | Admin panel (admin role only) |

## Admin

Sign in with the Google account matching `ADMIN_EMAIL`. Admin can:
- Add/edit/delete products and upload images
- Manage stock and publish status
- View orders and mark as shipped with tracking number
- Configure shipping rules and WhatsApp number

## Deployment

Deploy to Vercel and set all environment variables. Run database migrations:

```bash
npx prisma db push
npm run db:seed
```

Configure Cashfree webhook URL: `https://yourdomain.com/api/webhooks/cashfree`

## Shipping Rules (configurable in admin)

- Flat ₹150 shipping
- Free shipping on orders above ₹7,500
