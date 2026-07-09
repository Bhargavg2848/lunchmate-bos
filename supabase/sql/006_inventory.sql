-- Inventory module migration: stock config + transaction ledger

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  catalog_item_id uuid not null unique references public.catalog_items(id) on delete cascade,
  sku text,
  current_stock numeric(12,3) not null default 0 check (current_stock >= 0),
  min_stock_level numeric(12,3) not null default 0 check (min_stock_level >= 0),
  unit text not null default 'unit',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  type text not null check (type in ('in', 'out', 'adjustment')),
  quantity numeric(12,3) not null check (quantity > 0),
  reason text,
  reference_type text,
  reference_id uuid,
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_inventory_items_catalog_item_id
  on public.inventory_items(catalog_item_id);

create index if not exists idx_inventory_transactions_item_created_type
  on public.inventory_transactions(inventory_item_id, created_at desc, type);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_inventory_items_updated_at on public.inventory_items;
create trigger trg_inventory_items_updated_at
before update on public.inventory_items
for each row
execute function public.set_updated_at();

alter table public.inventory_items enable row level security;
alter table public.inventory_transactions enable row level security;

drop policy if exists "Allow authenticated read inventory_items" on public.inventory_items;
create policy "Allow authenticated read inventory_items"
on public.inventory_items
for select
to authenticated
using (true);

drop policy if exists "Allow authenticated insert inventory_items" on public.inventory_items;
create policy "Allow authenticated insert inventory_items"
on public.inventory_items
for insert
to authenticated
with check (true);

drop policy if exists "Allow authenticated update inventory_items" on public.inventory_items;
create policy "Allow authenticated update inventory_items"
on public.inventory_items
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Allow authenticated read inventory_transactions" on public.inventory_transactions;
create policy "Allow authenticated read inventory_transactions"
on public.inventory_transactions
for select
to authenticated
using (true);

drop policy if exists "Allow authenticated insert inventory_transactions" on public.inventory_transactions;
create policy "Allow authenticated insert inventory_transactions"
on public.inventory_transactions
for insert
to authenticated
with check (true);

drop policy if exists "Allow authenticated update inventory_transactions" on public.inventory_transactions;
create policy "Allow authenticated update inventory_transactions"
on public.inventory_transactions
for update
to authenticated
using (true)
with check (true);
