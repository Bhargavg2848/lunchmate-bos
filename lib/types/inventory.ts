export type InventoryItem = {
  id: string;
  catalog_item_id: string;
  catalog_item_name?: string;
  sku: string | null;
  current_stock: number;
  min_stock_level: number;
  unit: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type InventoryTransactionType = "in" | "out" | "adjustment";

export type InventoryTransaction = {
  id: string;
  inventory_item_id: string;
  type: InventoryTransactionType;
  quantity: number;
  reason: string | null;
  reference_type: string | null;
  reference_id: string | null;
  created_by: string | null;
  created_at: string;
};
