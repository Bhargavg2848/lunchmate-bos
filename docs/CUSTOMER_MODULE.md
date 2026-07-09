# Customer Module Setup

## 1) Apply SQL migration
Run `supabase/sql/002_customers.sql` in Supabase SQL editor.

## 2) Access UI
- Dashboard: `/dashboard`
- Customers: `/dashboard/customers`

## 3) Features included
- Add customer
- Edit customer
- Search customer by name/phone
- Customer count on dashboard

## 4) Known constraints (temporary)
- All authenticated users can write customers (will be tightened by role in next auth hardening step)
- Soft delete not yet added
