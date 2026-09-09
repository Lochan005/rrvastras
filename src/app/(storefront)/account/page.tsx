import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  Heart,
  Headset,
  Home,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatINR, cn } from "@/lib/utils";
import { SignOutButton } from "@/components/account/sign-out-button";
import { ORDER_STATUS_COPY, formatOrderDate } from "@/lib/order-status";

export default async function AccountPage() {
  const session = await requireAuth();
  const userId = session.user.id;

  const [user, orders, orderCount, wishlistCount, addressCount] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] } },
      }),
      prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.order.count({ where: { userId } }),
      prisma.wishlistItem.count({ where: { userId } }),
      prisma.address.count({ where: { userId } }),
    ]);

  const activeDispatch = orders.filter(
    (o) => o.status === "confirmed" || o.status === "shipped"
  ).length;
  const defaultAddress = user?.addresses[0];
  const displayName = session.user.name ?? "there";
  const firstName = displayName.split(" ")[0];
  const memberSince = user
    ? user.createdAt.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-[1360px] px-gutter-mobile pt-space-md pb-space-4xl lg:px-gutter-desktop">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-space-xs pb-space-lg font-body-sm text-body-sm text-on-surface-variant"
      >
        <Link href="/" className="flex items-center gap-1 transition-colors hover:text-primary">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <span className="text-outline-variant">/</span>
        <span className="font-semibold text-primary">My Account</span>
      </nav>

      <section className="relative mb-space-3xl overflow-hidden rounded-xl bg-surface-container-low p-space-xl shadow-sm lg:p-space-2xl">
        <div className="pointer-events-none absolute -top-16 -right-16 h-80 w-80 rounded-full bg-gradient-to-bl from-tertiary-fixed-dim/20 via-primary-container/5 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between gap-space-lg md:flex-row md:items-center">
          <div className="flex items-start gap-space-lg md:items-center">
            <div className="relative shrink-0">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt=""
                  width={96}
                  height={96}
                  className="h-20 w-20 rounded-full object-cover shadow-md md:h-24 md:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary font-headline-lg text-headline-lg text-tertiary-fixed shadow-md md:h-24 md:w-24">
                  {firstName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="absolute -right-1 -bottom-1 rounded-full bg-primary p-1.5 text-tertiary-fixed shadow-sm">
                <BadgeCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="rounded bg-primary px-2 py-0.5 font-label-eyebrow text-label-eyebrow tracking-widest text-tertiary-fixed uppercase">
                  Handloom Patron
                </span>
                {memberSince && (
                  <span className="flex items-center gap-1 font-body-sm text-body-sm text-outline">
                    <Calendar className="h-3.5 w-3.5" />
                    Member since {memberSince}
                  </span>
                )}
              </div>
              <h1 className="font-headline-xl text-headline-xl-mobile font-semibold tracking-tight text-primary md:text-headline-xl">
                Namaste, {displayName}
              </h1>
              <div className="flex flex-wrap items-center gap-space-md font-body-sm text-body-sm text-on-surface-variant">
                {session.user.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-secondary" />
                    {session.user.email}
                  </span>
                )}
                {defaultAddress?.phone && (
                  <>
                    <span className="hidden text-outline-variant sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-secondary" />
                      {defaultAddress.phone}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm pt-2 md:pt-0">
            <Link
              href="/account/addresses"
              className="inline-flex items-center gap-1.5 rounded bg-surface-container px-4 py-2.5 font-label-button text-label-button text-primary shadow-sm transition-colors hover:bg-surface-variant"
            >
              Preferences
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 rounded bg-primary px-5 py-2.5 font-label-button text-label-button text-on-primary shadow-sm transition-colors hover:bg-primary-container"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <span>Curated For You</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-space-3xl grid grid-cols-1 gap-space-lg md:grid-cols-3">
        <Link
          href="/account/orders"
          className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <div className="space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="h-[26px] w-[26px]" />
              </div>
              {activeDispatch > 0 ? (
                <span className="rounded-full bg-primary px-2.5 py-1 font-label-badge text-label-badge tracking-wider text-tertiary-fixed uppercase">
                  {activeDispatch} Active Dispatch
                </span>
              ) : (
                <span className="rounded-full bg-surface-container-high px-2.5 py-1 font-label-badge text-label-badge text-primary">
                  {orderCount} Order{orderCount === 1 ? "" : "s"}
                </span>
              )}
            </div>
            <div>
              <p className="font-label-eyebrow text-label-eyebrow tracking-widest text-outline uppercase">
                Drape Logistics
              </p>
              <h2 className="font-headline-md text-headline-md text-on-surface transition-colors group-hover:text-primary">
                My Orders
              </h2>
            </div>
            <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
              {orderCount} order{orderCount === 1 ? "" : "s"} placed · Track dispatch, view
              history, and manage your weaves.
            </p>
          </div>
          <div className="flex items-center gap-1.5 pt-space-lg font-label-button text-label-button font-semibold text-primary transition-transform group-hover:translate-x-1">
            <span>Manage Orders</span>
            <ArrowRight className="h-[18px] w-[18px]" />
          </div>
        </Link>

        <Link
          href="/account/wishlist"
          className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <div className="space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-container/40 text-primary">
                <Heart className="h-[26px] w-[26px]" />
              </div>
              <span className="rounded-full bg-surface-container-high px-2.5 py-1 font-label-badge text-label-badge text-primary">
                {wishlistCount} Saved Treasure{wishlistCount === 1 ? "" : "s"}
              </span>
            </div>
            <div>
              <p className="font-label-eyebrow text-label-eyebrow tracking-widest text-outline uppercase">
                Handpicked Stash
              </p>
              <h2 className="font-headline-md text-headline-md text-on-surface transition-colors group-hover:text-primary">
                My Wishlist
              </h2>
            </div>
            <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
              Sarees you have saved for upcoming festivities and everyday grace.
            </p>
          </div>
          <div className="flex items-center gap-1.5 pt-space-lg font-label-button text-label-button font-semibold text-primary transition-transform group-hover:translate-x-1">
            <span>View Wishlist</span>
            <ArrowRight className="h-[18px] w-[18px]" />
          </div>
        </Link>

        <Link
          href="/account/addresses"
          className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <div className="space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-tertiary-fixed-dim/30 text-tertiary">
                <MapPin className="h-[26px] w-[26px]" />
              </div>
              <span className="rounded-full bg-surface-container px-2.5 py-1 font-label-badge text-label-badge text-on-surface">
                {addressCount} Saved Location{addressCount === 1 ? "" : "s"}
              </span>
            </div>
            <div>
              <p className="font-label-eyebrow text-label-eyebrow tracking-widest text-outline uppercase">
                Dispatch Book
              </p>
              <h2 className="font-headline-md text-headline-md text-on-surface transition-colors group-hover:text-primary">
                Saved Addresses
              </h2>
            </div>
            <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
              Manage delivery addresses for seamless checkout across India.
            </p>
          </div>
          <div className="flex items-center gap-1.5 pt-space-lg font-label-button text-label-button font-semibold text-primary transition-transform group-hover:translate-x-1">
            <span>Update Addresses</span>
            <ArrowRight className="h-[18px] w-[18px]" />
          </div>
        </Link>
      </section>

      <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-12">
        <div className="space-y-space-xl lg:col-span-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="mb-1 block font-label-eyebrow text-label-eyebrow tracking-widest text-secondary uppercase">
                Authentic Weaves
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Recent Orders</h2>
            </div>
            <Link
              href="/account/orders"
              className="flex items-center gap-1 font-label-button text-label-button text-primary transition-colors hover:text-primary-container"
            >
              <span>View All ({orderCount})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-xl bg-surface-container-low px-space-lg py-16 text-center">
              <p className="font-headline-sm text-headline-sm text-primary">
                You haven&apos;t placed any orders yet.
              </p>
              <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                Start with a silk, cotton, or handloom drape from the collection.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex rounded bg-primary px-space-xl py-space-md font-label-button text-label-button tracking-wider text-on-primary uppercase"
              >
                Shop Collection
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const status = ORDER_STATUS_COPY[order.status] ?? {
                label: order.status.replace("_", " "),
              };
              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-y-2 bg-surface-container-low px-space-lg py-space-md font-body-sm text-body-sm text-on-surface-variant">
                    <div className="flex flex-wrap items-center gap-space-md">
                      <div>
                        <span className="block font-label-eyebrow text-[10px] text-outline uppercase">
                          Order Placed
                        </span>
                        <span className="font-semibold text-on-surface">
                          {formatOrderDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="hidden h-6 w-px bg-outline-variant/60 sm:block" />
                      <div>
                        <span className="block font-label-eyebrow text-[10px] text-outline uppercase">
                          Order ID
                        </span>
                        <span className="font-mono font-semibold text-primary">
                          {order.orderNumber}
                        </span>
                      </div>
                      <div className="hidden h-6 w-px bg-outline-variant/60 sm:block" />
                      <div>
                        <span className="block font-label-eyebrow text-[10px] text-outline uppercase">
                          Total Value
                        </span>
                        <span className="font-price-md text-price-md font-bold text-on-surface">
                          {formatINR(order.totalInPaise)}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1 font-label-badge text-label-badge tracking-wider uppercase",
                        status.active
                          ? "bg-primary/10 text-primary"
                          : status.shipped
                            ? "bg-surface-container-high text-secondary"
                            : "bg-surface-container-high text-on-surface"
                      )}
                    >
                      {status.active && (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                      )}
                      <span>{status.label}</span>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-container-high/60 px-space-lg py-space-sm text-on-surface-variant">
                      <div className="flex items-center gap-2 font-body-sm text-body-sm">
                        <Truck className="h-[18px] w-[18px] text-secondary" />
                        <span>
                          Tracking:{" "}
                          <strong className="font-mono text-on-surface">
                            {order.trackingNumber}
                          </strong>
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-space-md p-space-lg">
                    {order.items.map((item, index) => {
                      const thumb = item.product?.images[0];
                      return (
                        <div key={item.id}>
                          {index > 0 && (
                            <div className="mb-space-md h-px w-full bg-surface-container" />
                          )}
                          <div className="flex flex-col justify-between gap-space-md sm:flex-row sm:items-center">
                            <div className="flex items-center gap-space-md">
                              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container shadow-sm">
                                {thumb ? (
                                  <Image
                                    src={thumb.url}
                                    alt={thumb.alt || item.productName}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-[10px] text-outline">
                                    No img
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  {item.product?.fabric && (
                                    <span className="font-label-eyebrow text-label-eyebrow tracking-widest text-secondary uppercase">
                                      {item.product.fabric}
                                    </span>
                                  )}
                                  {item.product?.blouseIncluded && (
                                    <span className="rounded bg-surface-container-low px-2 py-0.5 text-[10px] font-semibold text-primary">
                                      Blouse Piece Included
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                  {item.productName}
                                  {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                                </h3>
                                <p className="font-price-md text-price-md font-bold text-primary">
                                  {formatINR(item.priceInPaise * item.quantity)}
                                </p>
                              </div>
                            </div>
                            {item.productSlug && (
                              <Link
                                href={`/shop/${item.productSlug}`}
                                className="self-end font-label-button text-label-button text-primary hover:underline sm:self-center"
                              >
                                View saree
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low px-space-lg py-space-sm">
                    <div className="flex items-center gap-2">
                      <Headset className="h-[18px] w-[18px] text-tertiary" />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Dedicated Dispatch Concierge Active
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 rounded bg-surface-container px-3.5 py-2 font-label-button text-label-button text-on-surface transition-colors hover:bg-surface-variant"
                      >
                        View Details
                      </Link>
                      {(order.status === "confirmed" || order.status === "shipped") && (
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 font-label-button text-label-button text-on-primary shadow-sm transition-colors hover:bg-primary-container"
                        >
                          <Truck className="h-4 w-4" />
                          Track Saree
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-space-xl lg:col-span-4">
          <div className="space-y-space-lg rounded-xl bg-surface-container-lowest p-space-xl shadow-sm">
            <div>
              <span className="mb-1 block font-label-eyebrow text-label-eyebrow tracking-widest text-secondary uppercase">
                RR Vastras Standard
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                The Patron Guarantee
              </h3>
            </div>
            <div className="space-y-space-md">
              <div className="flex items-start gap-space-sm">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                  <ShieldCheck className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <h4 className="font-headline-sm text-[15px] leading-tight text-on-surface">
                    100% Silk Mark Certified
                  </h4>
                  <p className="pt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                    Silk drapes carry verified artisan weave tags and authenticity seals.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-space-sm">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-secondary-container/30 text-primary">
                  <Shirt className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <h4 className="font-headline-sm text-[15px] leading-tight text-on-surface">
                    Complimentary Blouse Piece
                  </h4>
                  <p className="pt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                    Matching unstitched blouse fabric included with every saree.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-space-sm">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-tertiary-fixed-dim/30 text-tertiary">
                  <Package className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <h4 className="font-headline-sm text-[15px] leading-tight text-on-surface">
                    Insured Pan-India Transit
                  </h4>
                  <p className="pt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                    Dispatched securely with a 48-hour return window for unused items.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-space-md rounded-xl bg-surface-container-low p-space-xl shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Patron Profile
              </h3>
              <span className="flex items-center gap-1 rounded bg-surface-container px-2 py-0.5 font-label-badge text-label-badge font-semibold text-secondary">
                <Lock className="h-3.5 w-3.5" />
                Protected
              </span>
            </div>
            <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex justify-between py-1">
                <span className="text-outline">Primary Name</span>
                <span className="font-semibold text-on-surface">{displayName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-outline">Google Auth</span>
                <span className="text-on-surface">Connected</span>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <span className="shrink-0 text-outline">Email</span>
                <span className="truncate font-semibold text-on-surface">
                  {session.user.email}
                </span>
              </div>
            </div>
            <div className="space-y-2 pt-space-sm">
              <Link
                href="/account/addresses"
                className="inline-flex w-full items-center justify-center gap-2 rounded bg-surface-container-lowest py-2.5 font-label-button text-label-button text-on-surface shadow-sm transition-colors hover:bg-surface-variant"
              >
                Update Addresses
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
