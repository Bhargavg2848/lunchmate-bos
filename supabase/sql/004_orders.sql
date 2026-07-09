-- Orders module migration: orders + order_items

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  status text not null default 'placed' check (status in ('placed', 'preparing', 'completed', 'cancelled')),
  notes text,
  subtotal numeric(10,2) not null default 0 check (subtotal >= 0),
  tax numeric(10,2) not null default 0 check (tax >= 0),
  discount numeric(10,2) not null default 0 check (discount >= 0),
  grand_total numeric(10,2) not null default 0 check (grand_total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  catalog_item_id uuid not null references public.catalog_items(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  line_total numeric(10,2) not null check (line_total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists trg_order_items_updated_at on public.order_items;
create trigger trg_order_items_updated_at
before update on public.order_items
for each row
execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Allow authenticated read orders" on public.orders;
create policy "Allow authenticated read orders"
on public.orders
for select
to authenticated
using (true);

drop policy if exists "Allow authenticated insert orders" on public.orders;
create policy "Allow authenticated insert orders"
on public.orders
for insert
to authenticated
with check (true);

drop policy if exists "Allow authenticated update orders" on public.orders;
create policy "Allow authenticated update orders"
on public.orders
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Allow authenticated read order_items" on public.order_items;
create policy "Allow authenticated read order_items"
on public.order_items
for select
to authenticated
using (true);

drop policy if exists "Allow authenticated insert order_items" on public.order_items;
create policy "Allow authenticated insert order_items"
on public.order_items
for insert
to authenticated
with check (true);

drop policy if exists "Allow authenticated update order_items" on public.order_items;
create policy "Allow authenticated update order_items"
on public.order_items
for update
to authenticated
using (true)
with check (true);
