import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CatalogCategory, CatalogItem } from "@/lib/types/catalog";
import { AddCategoryForm } from "@/components/catalog/add-category-form";
import { EditCategoryForm } from "@/components/catalog/edit-category-form";
import { AddItemForm } from "@/components/catalog/add-item-form";
import { EditItemForm } from "@/components/catalog/edit-item-form";

export default async function CatalogPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const q = (searchParams.q || "").trim();

  const { data: categoriesData, error: categoriesError } = await supabase
    .from("catalog_categories")
    .select("id, name, description, is_active, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(100);

  let itemsQuery = supabase
    .from("catalog_items")
    .select("id, category_id, name, description, price, is_available, is_active, created_at, updated_at, catalog_categories(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (q) {
    itemsQuery = itemsQuery.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data: itemsData, error: itemsError } = await itemsQuery;

  const categories = (categoriesData || []) as CatalogCategory[];
  const items: CatalogItem[] = (itemsData || []).map((item: any) => ({
    ...item,
    category_name: item.catalog_categories?.name ?? "Uncategorized"
  }));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold">Catalog</h1>
        <p className="mt-2 text-slate-600">Manage product categories and items, including availability toggles.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <AddCategoryForm />
        <AddItemForm categories={categories.filter((c) => c.is_active)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 text-lg font-semibold">Categories</h2>
          {categoriesError ? <p className="text-sm text-red-600">{categoriesError.message}</p> : null}
          <div className="grid gap-3">
            {categories.length === 0 ? (
              <p className="text-sm text-slate-500">No categories found.</p>
            ) : (
              categories.map((category) => (
                <article key={category.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold">{category.name}</h3>
                    {category.description ? <p className="text-sm text-slate-600">{category.description}</p> : null}
                    <p className="text-xs text-slate-500">Status: {category.is_active ? "Active" : "Inactive"}</p>
                  </div>
                  <EditCategoryForm category={category} />
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Items</h2>
            <form className="w-full max-w-sm">
              <input
                name="q"
                defaultValue={q}
                placeholder="Search items"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </form>
          </div>

          {itemsError ? <p className="text-sm text-red-600">{itemsError.message}</p> : null}

          <div className="grid gap-3">
            {items.length === 0 ? (
              <p className="text-sm text-slate-500">No items found.</p>
            ) : (
              items.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-slate-600">Category: {item.category_name}</p>
                    <p className="text-sm text-slate-600">Price: ${item.price.toFixed(2)}</p>
                    {item.description ? <p className="text-sm text-slate-500">{item.description}</p> : null}
                    <p className="text-xs text-slate-500">Availability: {item.is_available ? "Available" : "Unavailable"}</p>
                  </div>
                  <EditItemForm item={item} categories={categories.filter((c) => c.is_active)} />
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
