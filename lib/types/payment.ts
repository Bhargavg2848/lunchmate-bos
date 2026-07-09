export const PAYMENT_METHODS = ["cash", "card", "upi", "bank_transfer", "other"] as const;
export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded", "partial"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export type Payment = {
  id: string;
  order_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_ref: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_grand_total?: number;
};

export type OrderPaymentSummary = {
  order_id: string;
  order_total: number;
  paid_amount: number;
  due_amount: number;
  payment_status: PaymentStatus;
};
