-- Lunchmate BOS: Customer module schema

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(phone)
);

create index if not exists idx_customers_full_name on public.customers using btree (full_name);
create index if not exists idx_customers_phone on public.customers using btree (phone);
create index if not exists idx_customers_created_at on public.customers using btree (created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

DROP TRIGGER IF EXISTS trg_customers_set_updated_at ON public.customers;

create trigger trg_customers_set_updated_at
before update on public.customers
for each row
execute procedure public.set_updated_at();

alter table public.customers enable row level security;

-- Read access for authenticated users
DROP POLICY IF EXISTS "customers_read_authenticated" ON public.customers;

create policy "customers_read_authenticated"
on public.customers
for select
using (auth.uid() is not null);

-- Write access for authenticated users (tighten later by role)
DROP POLICY IF EXISTS "customers_write_authenticated" ON public.customers;

create policy "customers_write_authenticated"
on public.customers
for all
using (auth.uid() is not null)
with check (auth.uid() is not null);
