export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  image_url: string | null;
  category: string;
  is_active: boolean;
  created_at: string;
}
