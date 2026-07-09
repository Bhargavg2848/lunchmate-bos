# Inventory Module

This module adds stock configuration and inventory ledger transactions with low-stock visibility.

## Included

- SQL migration for:
  - `inventory_items`
  - `inventory_transactions`
- Types and validation for inventory flows
- Server actions:
  - add stock (`in` transaction + stock increment)
  - adjust stock (`adjustment` transaction with negative-stock protection)
  - list inventory
- Inventory dashboard page with:
  - inventory table
  - low-stock badge
  - add stock form
  - adjust stock form
- Catalog page enhancement showing current stock/min level when available
- Dashboard metric card for low-stock items

## Business logic notes

- Low stock rule: `current_stock <= min_stock_level`.
- Adjustments reject updates that would make stock negative.
- Optional order-completion OUT transaction hook is scaffolded as TODO until finalized mapping is available.

## Revalidation

Mutations revalidate:
- `/dashboard/inventory`
- `/dashboard`
- `/dashboard/catalog`
