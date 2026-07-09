# Payments Module

This module introduces payment tracking with schema, validation, server actions, and dashboard pages.

## Included

- SQL migration for `payments`
- Payment types and validation utilities
- Server actions:
  - `createPayment`
  - `updatePaymentStatus` (optional status update flow)
- Payments dashboard with:
  - record payment form
  - recent payments table
  - status badge, method, transaction reference
- Orders page enhancement:
  - derived payment summary per order (`paid_amount`, `due_amount`, `payment_status`)
- Dashboard home metrics:
  - payments count
  - derived revenue from paid/partial payments

## Schema details

`payments` fields:
- `id`
- `order_id` (FK -> `orders.id`)
- `amount`
- `method` (`cash`, `card`, `upi`, `bank_transfer`, `other`)
- `status` (`pending`, `paid`, `failed`, `refunded`, `partial`)
- `transaction_ref`
- `paid_at`
- `notes`
- `created_at`
- `updated_at`

Indexes:
- `order_id`
- `status`
- `paid_at`
- `created_at`

RLS:
- Authenticated read/write policies (temporary broad access; tighten later)

## Revalidation

Mutations revalidate:
- `/dashboard/payments`
- `/dashboard/orders`
- `/dashboard`
