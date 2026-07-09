const MAX_NAME_LENGTH = 120;

export function validateCategoryInput(input: { name: string; description?: string }) {
  const errors: string[] = [];
  const name = input.name.trim();
  const description = (input.description || "").trim();

  if (!name) errors.push("Category name is required.");
  if (name.length > MAX_NAME_LENGTH) errors.push("Category name is too long.");

  return {
    valid: errors.length === 0,
    errors,
    normalized: {
      name,
      description: description || null
    }
  };
}

export function validateItemInput(input: {
  category_id: string;
  name: string;
  description?: string;
  price: string | number;
}) {
  const errors: string[] = [];
  const category_id = input.category_id.trim();
  const name = input.name.trim();
  const description = (input.description || "").trim();

  const rawPrice = typeof input.price === "number" ? input.price : Number(input.price);

  if (!category_id) errors.push("Category is required.");
  if (!name) errors.push("Item name is required.");
  if (name.length > MAX_NAME_LENGTH) errors.push("Item name is too long.");
  if (Number.isNaN(rawPrice)) errors.push("Price must be a valid number.");
  if (!Number.isNaN(rawPrice) && rawPrice < 0) errors.push("Price must be greater than or equal to 0.");

  return {
    valid: errors.length === 0,
    errors,
    normalized: {
      category_id,
      name,
      description: description || null,
      price: Number.isNaN(rawPrice) ? 0 : Number(rawPrice.toFixed(2))
    }
  };
}
