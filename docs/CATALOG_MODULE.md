# Catalog Module

This module adds catalog management with category/item schema, server actions, and dashboard UI.

## Included

- SQL migration for catalog categories and items
- TypeScript types and validation utilities
- Server actions for:
  - create/update categories
  - create/update items
  - category active toggle
  - item availability toggle
- Dashboard page for browsing/searching catalog items
- Client forms for add/edit category and add/edit item

## Files

- `supabase/sql/003_catalog.sql`
- `lib/types/catalog.ts`
- `lib/validation/catalog.ts`
- `app/dashboard/catalog/actions.ts`
- `components/catalog/add-category-form.tsx`
- `components/catalog/edit-category-form.tsx`
- `components/catalog/add-item-form.tsx`
- `components/catalog/edit-item-form.tsx`
- `app/dashboard/catalog/page.tsx`

## Usage

1. Run SQL migration `003_catalog.sql` in Supabase.
2. Navigate to `/dashboard/catalog`.
3. Add categories and items.
4. Use edit forms to update records and toggle availability/state.
