export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: number | null;
  updated_by_username?: string | null;
}

export interface ProductPayload {
  code?: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
}
