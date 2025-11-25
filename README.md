# MyShop

An Angular e-commerce application with shopping cart, orders, and address management.

## Features

- **Auth**: JWT tokens with refresh token + localStorage persistence
- **Shop**: Product catalog with filtering, ratings, and details
- **Cart & Wishlist**: Full shopping cart with coupons (SAVE10, SAVE20, WELCOME, SUMMER25)
- **Checkout**: 3-step flow (summary → address → confirm)
- **Orders**: Order history with cancellation
- **Addresses**: Saved addresses with default selection
- **State**: NgRx with effects + localStorage sync
- **UI**: Angular Material + animations
- **Mocking**: MSW for API simulation
- **Storybook**: Component documentation

## Quick Start

```bash
npm install
npm start              # → http://localhost:4200/
npm run storybook      # → http://localhost:6006/
```

## Routes

- `/login` - Authentication
- `/shop/products` - Product listing
- `/shop/products/:id` - Product details
- `/shop/cart` - Shopping cart
- `/shop/wishlist` - Wishlist
- `/shop/checkout/summary` - Checkout step 1
- `/shop/checkout/address` - Checkout step 2
- `/shop/checkout/confirm` - Checkout step 3
- `/shop/orders` - Order history
- `/shop/address` - Address management
- `/dashboard` - User dashboard
