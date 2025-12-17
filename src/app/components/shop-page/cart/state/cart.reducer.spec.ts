import { cartReducer } from './cart.reducer';
import { CartActions } from './cart.actions';
import { initialCartState } from './cart.state';
import { CartItem } from '../../models/cart-item.model';

describe('Cart Reducer', () => {
  describe('addItem', () => {
    it('should add a new item and increment count and total', () => {
      const product = {
        id: 1,
        name: 'Test Product',
        price: 100,
        imageUrl: 'test.jpg',
        stock: 10,
      };
      const quantity = 2;

      const action = CartActions.addItem({ product, quantity });
      const state = cartReducer(initialCartState, action);

      expect(state.items.length).toBe(1);
      expect(state.items[0].productId).toBe(1);
      expect(state.items[0].quantity).toBe(2);
      expect(state.count).toBe(2);
      expect(state.totalPrice).toBe(200);
    });

    it('should increment quantity if item already exists', () => {
      const existingItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        price: 100,
        quantity: 1,
        imageUrl: 'test.jpg',
        stock: 10,
      };

      const stateWithItem = {
        ...initialCartState,
        items: [existingItem],
        count: 1,
        totalPrice: 100,
      };

      const product = {
        id: 1,
        name: 'Test Product',
        price: 100,
        imageUrl: 'test.jpg',
        stock: 10,
      };

      const action = CartActions.addItem({ product, quantity: 2 });
      const state = cartReducer(stateWithItem, action);

      expect(state.items.length).toBe(1);
      expect(state.items[0].quantity).toBe(3);
      expect(state.count).toBe(3);
      expect(state.totalPrice).toBe(300);
    });

    it('should handle multiple different items', () => {
      const product1 = {
        id: 1,
        name: 'Product 1',
        price: 50,
        imageUrl: 'test1.jpg',
        stock: 5,
      };

      const product2 = {
        id: 2,
        name: 'Product 2',
        price: 75,
        imageUrl: 'test2.jpg',
        stock: 3,
      };

      let state = cartReducer(
        initialCartState,
        CartActions.addItem({ product: product1, quantity: 2 }),
      );
      state = cartReducer(state, CartActions.addItem({ product: product2, quantity: 1 }));

      expect(state.items.length).toBe(2);
      expect(state.count).toBe(3);
      expect(state.totalPrice).toBe(175);
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity and recalculate total', () => {
      const existingItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        price: 100,
        quantity: 2,
        imageUrl: 'test.jpg',
        stock: 10,
      };

      const stateWithItem = {
        ...initialCartState,
        items: [existingItem],
        count: 2,
        totalPrice: 200,
      };

      const action = CartActions.updateQuantity({ productId: 1, quantity: 5 });
      const state = cartReducer(stateWithItem, action);

      expect(state.items[0].quantity).toBe(5);
      expect(state.count).toBe(5);
      expect(state.totalPrice).toBe(500);
    });

    it('should remove item when quantity is set to 0', () => {
      const existingItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        price: 100,
        quantity: 2,
        imageUrl: 'test.jpg',
        stock: 10,
      };

      const stateWithItem = {
        ...initialCartState,
        items: [existingItem],
        count: 2,
        totalPrice: 200,
      };

      const action = CartActions.updateQuantity({ productId: 1, quantity: 0 });
      const state = cartReducer(stateWithItem, action);

      expect(state.items.length).toBe(0);
      expect(state.count).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('should remove item when quantity is negative', () => {
      const existingItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        price: 100,
        quantity: 2,
        imageUrl: 'test.jpg',
        stock: 10,
      };

      const stateWithItem = {
        ...initialCartState,
        items: [existingItem],
        count: 2,
        totalPrice: 200,
      };

      const action = CartActions.updateQuantity({ productId: 1, quantity: -1 });
      const state = cartReducer(stateWithItem, action);

      expect(state.items.length).toBe(0);
      expect(state.count).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('removeItem', () => {
    it('should remove item and recalculate total', () => {
      const item1: CartItem = {
        productId: 1,
        name: 'Product 1',
        price: 100,
        quantity: 2,
        imageUrl: 'test1.jpg',
        stock: 10,
      };

      const item2: CartItem = {
        productId: 2,
        name: 'Product 2',
        price: 50,
        quantity: 1,
        imageUrl: 'test2.jpg',
        stock: 5,
      };

      const stateWithItems = {
        ...initialCartState,
        items: [item1, item2],
        count: 3,
        totalPrice: 250,
      };

      const action = CartActions.removeItem({ productId: 1 });
      const state = cartReducer(stateWithItems, action);

      expect(state.items.length).toBe(1);
      expect(state.items[0].productId).toBe(2);
      expect(state.count).toBe(1);
      expect(state.totalPrice).toBe(50);
    });

    it('should handle removing the last item', () => {
      const existingItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        price: 100,
        quantity: 1,
        imageUrl: 'test.jpg',
        stock: 10,
      };

      const stateWithItem = {
        ...initialCartState,
        items: [existingItem],
        count: 1,
        totalPrice: 100,
      };

      const action = CartActions.removeItem({ productId: 1 });
      const state = cartReducer(stateWithItem, action);

      expect(state.items.length).toBe(0);
      expect(state.count).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('should not change state when removing non-existent item', () => {
      const existingItem: CartItem = {
        productId: 1,
        name: 'Test Product',
        price: 100,
        quantity: 1,
        imageUrl: 'test.jpg',
        stock: 10,
      };

      const stateWithItem = {
        ...initialCartState,
        items: [existingItem],
        count: 1,
        totalPrice: 100,
      };

      const action = CartActions.removeItem({ productId: 999 });
      const state = cartReducer(stateWithItem, action);

      expect(state.items.length).toBe(1);
      expect(state.count).toBe(1);
      expect(state.totalPrice).toBe(100);
    });
  });

  describe('clearCart', () => {
    it('should reset cart to initial state', () => {
      const item: CartItem = {
        productId: 1,
        name: 'Test Product',
        price: 100,
        quantity: 2,
        imageUrl: 'test.jpg',
        stock: 10,
      };

      const stateWithItem = {
        ...initialCartState,
        items: [item],
        count: 2,
        totalPrice: 200,
      };

      const action = CartActions.clearCart();
      const state = cartReducer(stateWithItem, action);

      expect(state).toEqual(initialCartState);
      expect(state.items.length).toBe(0);
      expect(state.count).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });
});
