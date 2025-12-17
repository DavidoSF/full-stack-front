import { createReducer, on } from '@ngrx/store';
import { initialCartState } from './cart.state';
import { CartItem } from '../../models/cart-item.model';
import { CartActions } from './cart.actions';

export const cartReducer = createReducer(
  initialCartState,
  on(CartActions.addItem, (state, { product, quantity }) => {
    const existingItemIndex = state.items.findIndex((item) => item.productId === product.id);

    let updatedItems: CartItem[];
    if (existingItemIndex >= 0) {
      updatedItems = state.items.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
      );
    } else {
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
        stock: product.stock,
      };
      updatedItems = [...state.items, newItem];
    }

    const totalPrice = calculateTotal(updatedItems, state.discount);
    const count = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...state,
      items: updatedItems,
      totalPrice,
      count,
    };
  }),

  on(CartActions.removeItem, (state, { productId }) => {
    const updatedItems = state.items.filter((item) => item.productId !== productId);
    const totalPrice = calculateTotal(updatedItems, state.discount);
    const count = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...state,
      items: updatedItems,
      totalPrice,
      count,
    };
  }),

  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      const updatedItems = state.items.filter((item) => item.productId !== productId);
      const totalPrice = calculateTotal(updatedItems, state.discount);
      const count = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: updatedItems,
        totalPrice,
        count,
      };
    }

    const updatedItems = state.items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    );
    const totalPrice = calculateTotal(updatedItems, state.discount);
    const count = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...state,
      items: updatedItems,
      totalPrice,
      count,
    };
  }),

  on(CartActions.clearCart, () => initialCartState),

  on(CartActions.loadCart, (state) => ({ ...state, loading: true })),

  on(CartActions.loadCartSuccess, (state, { items }) => {
    const totalPrice = calculateTotal(items, state.discount);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...state,
      items,
      totalPrice,
      count,
      loading: false,
    };
  }),

  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CartActions.applyCoupon, (state) => ({ ...state, loading: true })),

  on(CartActions.applyCouponSuccess, (state, { couponCode, discount }) => {
    const totalPrice = calculateTotal(state.items, discount);

    return {
      ...state,
      couponCode,
      discount,
      totalPrice,
      loading: false,
    };
  }),

  on(CartActions.applyCouponFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CartActions.applyPromoCode, (state) => ({ ...state, loading: true, error: null })),

  on(
    CartActions.applyPromoCodeSuccess,
    (state, { promoCode, itemsTotal, discount, shipping, taxes, grandTotal, appliedPromos }) => ({
      ...state,
      promoCode,
      promoDiscount: discount,
      shipping,
      taxes,
      totalPrice: grandTotal,
      appliedPromos,
      loading: false,
      error: null,
    }),
  ),

  on(CartActions.applyPromoCodeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CartActions.removePromoCode, (state) => {
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = state.discount ? subtotal * (state.discount / 100) : 0;
    const totalPrice = Number((subtotal - discountAmount).toFixed(2));

    return {
      ...state,
      promoCode: undefined,
      promoDiscount: undefined,
      shipping: undefined,
      taxes: undefined,
      appliedPromos: undefined,
      totalPrice,
    };
  }),

  on(
    CartActions.autoApplyPromoSuccess,
    (state, { promoCode, itemsTotal, discount, shipping, taxes, grandTotal, appliedPromos }) => ({
      ...state,
      promoCode,
      promoDiscount: discount,
      shipping,
      taxes,
      totalPrice: grandTotal,
      appliedPromos,
      loading: false,
      error: null,
    }),
  ),

  on(CartActions.autoApplyPromoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

function calculateTotal(items: CartItem[], discount?: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discount ? subtotal * (discount / 100) : 0;
  return Number((subtotal - discountAmount).toFixed(2));
}
