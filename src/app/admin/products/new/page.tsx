import { requireAdmin } from "@/lib/session";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Add Product</h1>
      <ProductForm />
    </div>
  );
}
