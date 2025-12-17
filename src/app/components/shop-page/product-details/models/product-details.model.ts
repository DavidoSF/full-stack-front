export interface ProductDetails {
  id: number;
  name: string;
  price: number;
  created_at: string;
  owner_id: number;
  avg_rating: number;
  ratings_count: number;
  description: string;
  stock: number;
  lowStockThreshold: number;
  category: string;
  promo?: {
    type: 'percentage' | 'free_shipping';
    value?: number;
    label: string;
  };
}
