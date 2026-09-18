export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/account/sign-out-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/admin" className="text-lg font-semibold text-primary">
            RR Vastras Admin
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted hover:text-primary">
              ← Back to store
            </Link>
            <SignOutButton className="py-2" />
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
        <AdminNav />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
