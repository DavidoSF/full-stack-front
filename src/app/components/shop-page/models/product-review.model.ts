export interface ProductReview {
  id?: string;
  productId: number;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}
