import { selectWishlistItems, selectWishlistCount, selectIsInWishlist } from './wishlist.selectors';
import { WishlistState } from './wishlist.state';
import { WishlistItem } from '../../models/wishlist-item.model';

describe('Wishlist Selectors', () => {
  const mockItem1: WishlistItem = {
    productId: 1,
    name: 'Product 1',
    price: 50,
    imageUrl: 'test1.jpg',
    stock: 10,
    lowStockThreshold: 3,
    addedAt: new Date().toISOString(),
  };

  const mockItem2: WishlistItem = {
    productId: 2,
    name: 'Product 2',
    price: 100,
    imageUrl: 'test2.jpg',
    stock: 5,
    lowStockThreshold: 2,
    addedAt: new Date().toISOString(),
  };

  const mockWishlistState: WishlistState = {
    items: [mockItem1, mockItem2],
    loading: false,
    error: null,
  };

  const mockAppState = {
    wishlist: mockWishlistState,
  };

  describe('selectWishlistItems (composed selector)', () => {
    it('should select all wishlist items', () => {
      const result = selectWishlistItems(mockAppState as any);
      expect(result).toEqual([mockItem1, mockItem2]);
      expect(result.length).toBe(2);
    });

    it('should return empty array when wishlist is empty', () => {
      const emptyState = { wishlist: { ...mockWishlistState, items: [] } };
      const result = selectWishlistItems(emptyState as any);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should preserve item order', () => {
      const result = selectWishlistItems(mockAppState as any);
      expect(result[0].productId).toBe(1);
      expect(result[1].productId).toBe(2);
    });
  });

  describe('selectWishlistCount (composed selector)', () => {
    it('should return count of items in wishlist', () => {
      const result = selectWishlistCount(mockAppState as any);
      expect(result).toBe(2);
    });

    it('should return 0 when wishlist is empty', () => {
      const emptyState = { wishlist: { ...mockWishlistState, items: [] } };
      const result = selectWishlistCount(emptyState as any);
      expect(result).toBe(0);
    });

    it('should update count when items change', () => {
      const state = {
        wishlist: {
          ...mockWishlistState,
          items: [mockItem1, mockItem2, { ...mockItem1, productId: 3 }],
        },
      };
      const result = selectWishlistCount(state as any);
      expect(result).toBe(3);
    });
  });

  describe('selectIsInWishlist (parameterized selector)', () => {
    it('should return true when product is in wishlist', () => {
      const selector = selectIsInWishlist(1);
      const result = selector(mockAppState as any);
      expect(result).toBe(true);
    });

    it('should return false when product is not in wishlist', () => {
      const selector = selectIsInWishlist(999);
      const result = selector(mockAppState as any);
      expect(result).toBe(false);
    });

    it('should work with empty wishlist', () => {
      const emptyState = { wishlist: { ...mockWishlistState, items: [] } };
      const selector = selectIsInWishlist(1);
      const result = selector(emptyState as any);
      expect(result).toBe(false);
    });

    it('should handle multiple checks correctly', () => {
      const selector1 = selectIsInWishlist(1);
      const selector2 = selectIsInWishlist(2);
      const selector3 = selectIsInWishlist(3);

      expect(selector1(mockAppState as any)).toBe(true);
      expect(selector2(mockAppState as any)).toBe(true);
      expect(selector3(mockAppState as any)).toBe(false);
    });
  });
});
