import type { InventoryTransactionType } from "@/lib/types/inventory";

const TXN_TYPES: InventoryTransactionType[] = ["in", "out", "adjustment"];

export function isValidInventoryTransactionType(value: string): value is InventoryTransactionType {
  return TXN_TYPES.includes(value as InventoryTransactionType);
}

export function validateAddStockInput(input: {
  inventory_item_id: string;
  quantity: string | number;
  reason?: string;
  reference_type?: string;
  reference_id?: string;
}) {
  const errors: string[] = [];

  const inventory_item_id = String(input.inventory_item_id || "").trim();
  const quantityNum = typeof input.quantity === "number" ? input.quantity : Number(input.quantity);

  if (!inventory_item_id) errors.push("Inventory item is required.");
  if (Number.isNaN(quantityNum) || quantityNum <= 0) errors.push("Quantity must be greater than 0.");

  return {
    valid: errors.length === 0,
    errors,
    normalized: {
      inventory_item_id,
      quantity: Number.isNaN(quantityNum) ? 0 : Number(quantityNum.toFixed(3)),
      reason: String(input.reason || "").trim() || null,
      reference_type: String(input.reference_type || "").trim() || null,
      reference_id: String(input.reference_id || "").trim() || null
    }
  };
}

export function validateAdjustStockInput(input: {
  inventory_item_id: string;
  delta: string | number;
  reason?: string;
  reference_type?: string;
  reference_id?: string;
}) {
  const errors: string[] = [];

  const inventory_item_id = String(input.inventory_item_id || "").trim();
  const deltaNum = typeof input.delta === "number" ? input.delta : Number(input.delta);

  if (!inventory_item_id) errors.push("Inventory item is required.");
  if (Number.isNaN(deltaNum) || deltaNum === 0) errors.push("Adjustment delta must be non-zero.");

  return {
    valid: errors.length === 0,
    errors,
    normalized: {
      inventory_item_id,
      delta: Number.isNaN(deltaNum) ? 0 : Number(deltaNum.toFixed(3)),
      reason: String(input.reason || "").trim() || null,
      reference_type: String(input.reference_type || "").trim() || null,
      reference_id: String(input.reference_id || "").trim() || null
    }
  };
}
