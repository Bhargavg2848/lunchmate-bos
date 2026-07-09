export const ORDER_STATUSES = ["placed", "preparing", "completed", "cancelled"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Order = {
  id: string;
  customer_id: string | null;
  customer_name?: string | null;
  status: OrderStatus;
  notes: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  grand_total: number;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  catalog_item_id: string;
  item_name?: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
  updated_at: string;
};
