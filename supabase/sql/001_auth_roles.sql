-- Lunchmate BOS: Initial RBAC schema
-- Apply in Supabase SQL editor

create extension if not exists pgcrypto;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text unique not null check (code in ('admin', 'staff', 'kitchen', 'cashier')),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, role_id)
);

insert into public.roles(code, name)
values
  ('admin', 'Administrator'),
  ('staff', 'Staff'),
  ('kitchen', 'Kitchen'),
  ('cashier', 'Cashier')
on conflict (code) do nothing;

alter table public.roles enable row level security;
alter table public.user_roles enable row level security;

-- Minimal safe read policy for authenticated users
create policy if not exists "roles_read_authenticated"
on public.roles
for select
using (auth.uid() is not null);

create policy if not exists "user_roles_read_own"
on public.user_roles
for select
using (auth.uid() = user_id);
