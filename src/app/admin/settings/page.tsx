import { requireAdmin } from "@/lib/session";
import { getStoreSettings } from "@/lib/store";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getStoreSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Store Settings</h1>
      <p className="mt-2 text-sm text-muted">
        Configure shipping rules, WhatsApp number, and stock thresholds.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
