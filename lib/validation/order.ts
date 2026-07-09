import { ORDER_STATUSES, type OrderStatus } from "@/lib/types/order";

export function isValidOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

export function validateOrderStatusInput(status: string) {
  const normalized = status.trim();

  if (!isValidOrderStatus(normalized)) {
    return { valid: false, error: "Invalid order status." };
  }

  return { valid: true, normalized: normalized as OrderStatus };
}

export type OrderCreateItemInput = {
  catalog_item_id: string;
  quantity: number;
};

export function validateCreateOrderInput(input: {
  customer_id?: string;
  notes?: string;
  items: OrderCreateItemInput[];
}) {
  const errors: string[] = [];

  const customer_id = (input.customer_id || "").trim() || null;
  const notes = (input.notes || "").trim() || null;

  if (!Array.isArray(input.items) || input.items.length === 0) {
    errors.push("At least one order item is required.");
  }

  const normalizedItems = (input.items || []).map((item) => ({
    catalog_item_id: String(item.catalog_item_id || "").trim(),
    quantity: Number(item.quantity)
  }));

  normalizedItems.forEach((item, index) => {
    if (!item.catalog_item_id) {
      errors.push(`Item ${index + 1}: catalog item is required.`);
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      errors.push(`Item ${index + 1}: quantity must be greater than 0.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    normalized: {
      customer_id,
      notes,
      items: normalizedItems
    }
  };
}
