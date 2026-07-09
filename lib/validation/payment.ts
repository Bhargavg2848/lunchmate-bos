import {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  type PaymentMethod,
  type PaymentStatus
} from "@/lib/types/payment";

export function isValidPaymentMethod(value: string): value is PaymentMethod {
  return PAYMENT_METHODS.includes(value as PaymentMethod);
}

export function isValidPaymentStatus(value: string): value is PaymentStatus {
  return PAYMENT_STATUSES.includes(value as PaymentStatus);
}

export function validatePaymentCreateInput(input: {
  order_id: string;
  amount: string | number;
  method: string;
  status: string;
  transaction_ref?: string;
  paid_at?: string;
  notes?: string;
}) {
  const errors: string[] = [];

  const order_id = String(input.order_id || "").trim();
  const method = String(input.method || "").trim();
  const status = String(input.status || "").trim();
  const amount = typeof input.amount === "number" ? input.amount : Number(input.amount);

  if (!order_id) errors.push("Order id is required.");
  if (Number.isNaN(amount) || amount <= 0) errors.push("Amount must be greater than 0.");
  if (!isValidPaymentMethod(method)) errors.push("Invalid payment method.");
  if (!isValidPaymentStatus(status)) errors.push("Invalid payment status.");

  return {
    valid: errors.length === 0,
    errors,
    normalized: {
      order_id,
      amount: Number.isNaN(amount) ? 0 : Number(amount.toFixed(2)),
      method: (method || "other") as PaymentMethod,
      status: (status || "pending") as PaymentStatus,
      transaction_ref: String(input.transaction_ref || "").trim() || null,
      paid_at: String(input.paid_at || "").trim() || null,
      notes: String(input.notes || "").trim() || null
    }
  };
}

export function validatePaymentStatusInput(status: string) {
  const normalized = String(status || "").trim();
  if (!isValidPaymentStatus(normalized)) {
    return { valid: false, error: "Invalid payment status." };
  }
  return { valid: true, normalized: normalized as PaymentStatus };
}
