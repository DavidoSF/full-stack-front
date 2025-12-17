export interface WishlistItem {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  addedAt: string;
  stock?: number;
  lowStockThreshold?: number;
}
