-- Catalog module migration: categories + items

create table if not exists public.catalog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_categories_name_unique unique (name)
);

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.catalog_categories(id) on delete restrict,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  is_available boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_items_name_category_unique unique (category_id, name)
);

create index if not exists idx_catalog_items_category_id on public.catalog_items(category_id);
create index if not exists idx_catalog_items_available on public.catalog_items(is_available);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_catalog_categories_updated_at on public.catalog_categories;
create trigger trg_catalog_categories_updated_at
before update on public.catalog_categories
for each row
execute function public.set_updated_at();

drop trigger if exists trg_catalog_items_updated_at on public.catalog_items;
create trigger trg_catalog_items_updated_at
before update on public.catalog_items
for each row
execute function public.set_updated_at();

alter table public.catalog_categories enable row level security;
alter table public.catalog_items enable row level security;

drop policy if exists "Allow authenticated read categories" on public.catalog_categories;
create policy "Allow authenticated read categories"
on public.catalog_categories
for select
to authenticated
using (true);

drop policy if exists "Allow authenticated insert categories" on public.catalog_categories;
create policy "Allow authenticated insert categories"
on public.catalog_categories
for insert
to authenticated
with check (true);

drop policy if exists "Allow authenticated update categories" on public.catalog_categories;
create policy "Allow authenticated update categories"
on public.catalog_categories
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Allow authenticated read items" on public.catalog_items;
create policy "Allow authenticated read items"
on public.catalog_items
for select
to authenticated
using (true);

drop policy if exists "Allow authenticated insert items" on public.catalog_items;
create policy "Allow authenticated insert items"
on public.catalog_items
for insert
to authenticated
with check (true);

drop policy if exists "Allow authenticated update items" on public.catalog_items;
create policy "Allow authenticated update items"
on public.catalog_items
for update
to authenticated
using (true)
with check (true);
