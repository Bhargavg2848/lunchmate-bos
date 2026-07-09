-- Payments module migration

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  method text not null check (method in ('cash', 'card', 'upi', 'bank_transfer', 'other')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded', 'partial')),
  transaction_ref text,
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payments_order_id on public.payments(order_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_payments_paid_at on public.payments(paid_at desc);
create index if not exists idx_payments_created_at on public.payments(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_payments_updated_at on public.payments;
create trigger trg_payments_updated_at
before update on public.payments
for each row
execute function public.set_updated_at();

alter table public.payments enable row level security;

drop policy if exists "Allow authenticated read payments" on public.payments;
create policy "Allow authenticated read payments"
on public.payments
for select
to authenticated
using (true);

drop policy if exists "Allow authenticated insert payments" on public.payments;
create policy "Allow authenticated insert payments"
on public.payments
for insert
to authenticated
with check (true);

drop policy if exists "Allow authenticated update payments" on public.payments;
create policy "Allow authenticated update payments"
on public.payments
for update
to authenticated
using (true)
with check (true);
