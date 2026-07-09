export function validateCustomerInput(input: {
  full_name: string;
  phone: string;
  email?: string;
  notes?: string;
}) {
  const errors: string[] = [];

  const fullName = input.full_name?.trim();
  const phone = input.phone?.trim();
  const email = input.email?.trim();

  if (!fullName || fullName.length < 2) {
    errors.push("Full name must be at least 2 characters.");
  }

  if (!phone || phone.length < 7) {
    errors.push("Phone must be at least 7 digits/characters.");
  }

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Email format is invalid.");
  }

  return {
    valid: errors.length === 0,
    errors,
    normalized: {
      full_name: fullName,
      phone,
      email: email || null,
      notes: input.notes?.trim() || null
    }
  };
}
