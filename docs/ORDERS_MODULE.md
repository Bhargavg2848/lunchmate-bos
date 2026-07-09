# Orders Module

This module adds order management with order and order_items schema, create/list flow, and status updates.

## Included

- SQL migration for `orders` and `order_items`
- Status validation (`placed`, `preparing`, `completed`, `cancelled`)
- Totals on orders (`subtotal`, `tax`, `discount`, `grand_total`)
- Server actions for:
  - creating orders with multiple items
  - updating order status
- Orders dashboard page with create form and recent orders list
- Dashboard metric card for orders count

## Files

- `supabase/sql/004_orders.sql`
- `lib/types/order.ts`
- `lib/validation/order.ts`
- `app/dashboard/orders/actions.ts`
- `components/orders/create-order-form.tsx`
- `components/orders/order-status-badge.tsx`
- `components/orders/update-order-status-form.tsx`
- `app/dashboard/orders/page.tsx`
- `app/dashboard/page.tsx`

## Notes

- RLS policies are currently broad (`authenticated` read/write) and should be tightened later.
- `order_items` are priced using current catalog item price at order creation time.
