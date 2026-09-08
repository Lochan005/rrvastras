import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AddressForm } from "@/components/account/address-form";

export default async function AddressesPage() {
  const session = await requireAuth();

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto w-full max-w-[760px] px-gutter-mobile pt-space-md pb-space-4xl lg:px-gutter-desktop">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-space-xs pb-space-lg font-body-sm text-body-sm text-on-surface-variant"
      >
        <Link href="/" className="flex items-center gap-1 hover:text-primary">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-outline" />
        <Link href="/account" className="hover:text-primary">
          My Account
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-outline" />
        <span className="font-semibold text-primary">Addresses</span>
      </nav>

      <span className="font-label-eyebrow text-label-eyebrow font-bold tracking-[0.25em] text-primary uppercase">
        Dispatch Book
      </span>
      <h1 className="font-headline-xl text-headline-xl-mobile mt-space-2xs tracking-wide text-primary md:text-headline-xl">
        Saved Addresses
      </h1>
      <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
        {addresses.length} saved location{addresses.length === 1 ? "" : "s"} for seamless checkout
      </p>

      <div className="mt-space-2xl space-y-space-md">
        {addresses.length === 0 && (
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            No addresses yet. Add one below.
          </p>
        )}
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
          >
            <p className="font-headline-sm text-headline-sm text-on-surface">
              {addr.name}
              {addr.isDefault && (
                <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 font-label-badge text-[10px] tracking-wider text-primary uppercase">
                  Default
                </span>
              )}
            </p>
            <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
              {addr.line1}
              {addr.line2 && `, ${addr.line2}`}
              <br />
              {addr.city}, {addr.state} — {addr.pincode}
              <br />
              {addr.phone}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-space-2xl rounded-xl bg-surface-container-low p-space-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface">Add New Address</h2>
        <AddressForm />
      </div>
    </div>
  );
}
