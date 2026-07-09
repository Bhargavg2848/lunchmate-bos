export type CatalogCategory = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CatalogItem = {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
