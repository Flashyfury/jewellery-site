export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  emoji: string | null;
  hero_bg: string | null;
  hero_image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: string | null;
  category?: Category | null;   // populated via join
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
}
