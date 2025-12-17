import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartSubtotal,
  selectCartPageTotal,
  selectCartDiscount,
} from './cart.selectors';
import { CartState } from './cart.state';
import { CartItem } from '../../models/cart-item.model';

describe('Cart Selectors', () => {
  const mockItem1: CartItem = {
    productId: 1,
    name: 'Product 1',
    price: 50,
    quantity: 2,
    imageUrl: 'test1.jpg',
    stock: 10,
  };

  const mockItem2: CartItem = {
    productId: 2,
    name: 'Product 2',
    price: 100,
    quantity: 1,
    imageUrl: 'test2.jpg',
    stock: 5,
  };

  const mockCartState: CartState = {
    items: [mockItem1, mockItem2],
    count: 3,
    totalPrice: 200,
    loading: false,
    discount: 10,
    error: null,
  };

  const mockAppState = {
    cart: mockCartState,
  };

  describe('selectCartItems', () => {
    it('should select cart items from state', () => {
      const result = selectCartItems(mockAppState as any);
      expect(result).toEqual([mockItem1, mockItem2]);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no items', () => {
      const emptyState = { cart: { ...mockCartState, items: [] } };
      const result = selectCartItems(emptyState as any);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('selectCartCount (composed selector)', () => {
    it('should return total count of items in cart', () => {
      const result = selectCartCount(mockAppState as any);
      expect(result).toBe(3);
    });

    it('should return 0 when cart is empty', () => {
      const emptyState = { cart: { ...mockCartState, items: [], count: 0 } };
      const result = selectCartCount(emptyState as any);
      expect(result).toBe(0);
    });
  });

  describe('selectCartTotal (composed selector)', () => {
    it('should return total price of cart', () => {
      const result = selectCartTotal(mockAppState as any);
      expect(result).toBe(200);
    });

    it('should return 0 when cart is empty', () => {
      const emptyState = { cart: { ...mockCartState, items: [], totalPrice: 0 } };
      const result = selectCartTotal(emptyState as any);
      expect(result).toBe(0);
    });
  });

  describe('selectCartSubtotal (memoized selector)', () => {
    it('should calculate subtotal from items', () => {
      const result = selectCartSubtotal(mockAppState as any);
      // (50 * 2) + (100 * 1) = 200
      expect(result).toBe(200);
    });

    it('should return 0 when cart is empty', () => {
      const emptyState = { cart: { ...mockCartState, items: [] } };
      const result = selectCartSubtotal(emptyState as any);
      expect(result).toBe(0);
    });

    it('should calculate correctly with different quantities', () => {
      const state = {
        cart: {
          ...mockCartState,
          items: [
            { ...mockItem1, quantity: 5 }, // 50 * 5 = 250
            { ...mockItem2, quantity: 3 }, // 100 * 3 = 300
          ],
        },
      };
      const result = selectCartSubtotal(state as any);
      expect(result).toBe(550);
    });
  });

  describe('selectCartDiscount (composed selector)', () => {
    it('should return discount percentage', () => {
      const result = selectCartDiscount(mockAppState as any);
      expect(result).toBe(10);
    });

    it('should return 0 when no discount', () => {
      const state = { cart: { ...mockCartState, discount: undefined } };
      const result = selectCartDiscount(state as any);
      expect(result).toBe(0);
    });
  });

  describe('selectCartPageTotal (composed/memoized selector)', () => {
    it('should calculate total with discount applied', () => {
      const result = selectCartPageTotal(mockAppState as any);
      // subtotal = 200, discount = 10%
      // 200 - (200 * 0.10) = 180
      expect(result).toBe(180);
    });

    it('should return subtotal when no discount', () => {
      const state = { cart: { ...mockCartState, discount: undefined } };
      const result = selectCartPageTotal(state as any);
      expect(result).toBe(200);
    });

    it('should handle 0% discount', () => {
      const state = { cart: { ...mockCartState, discount: 0 } };
      const result = selectCartPageTotal(state as any);
      expect(result).toBe(200);
    });

    it('should handle 100% discount', () => {
      const state = { cart: { ...mockCartState, discount: 100 } };
      const result = selectCartPageTotal(state as any);
      expect(result).toBe(0);
    });

    it('should round to 2 decimal places', () => {
      const state = {
        cart: {
          ...mockCartState,
          items: [
            { ...mockItem1, price: 33.33, quantity: 1 }, // 33.33
          ],
          discount: 15, // 15% off
        },
      };
      const result = selectCartPageTotal(state as any);
      // 33.33 - (33.33 * 0.15) = 28.3305 -> 28.33
      expect(result).toBe(28.33);
    });
  });
});
