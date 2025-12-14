# MyShop

An Angular e-commerce application with shopping cart, orders, and address management.

## Features

- **Auth**: JWT tokens with refresh token + localStorage persistence
- **User Account**: Profile management with preferences (newsletter, default rating filter)
- **Shop**: Product catalog with filtering, ratings, and details
- **Cart & Wishlist**: Full shopping cart with coupons (SAVE10, SAVE20, WELCOME, SUMMER25)
- **Wishlist**: Favorite products with animated heart icon + badge counter
- **Checkout**: 3-step flow (summary → address → confirm)
- **Orders**: Full order history with detailed order view
- **Addresses**: Saved addresses with default selection
- **State**: NgRx with dedicated slices (user, auth, cart, wishlist, order, address) + localStorage sync
- **UI**: Angular Material + smooth animations
- **Mocking**: MSW for API simulation (8+ endpoints)
- **Storybook**: Component documentation

## Quick Start

```bash
npm install
npm start              # → http://localhost:4200/
npm run storybook      # → http://localhost:6006/
```

## Routes

### Public

- `/login` - Authentication
- `/dashboard` - User dashboard

### Shop (Auth Required)

- `/shop/products` - Product listing with filtering
- `/shop/products/:id` - Product details
- `/shop/cart` - Shopping cart
- `/shop/wishlist` - Wishlist with add/remove
- `/shop/checkout/summary` - Checkout step 1
- `/shop/checkout/address` - Checkout step 2 (saved addresses)
- `/shop/checkout/confirm` - Checkout step 3
- `/shop/address` - Address management (CRUD)

### Account (Auth Required)

- `/account/profile` - User profile + preferences
- `/account/orders` - Order history list
- `/account/orders/:id` - Detailed order view

## State Management

### NgRx Slices

- **user**: Profile, preferences, orders summary
- **auth**: Login, tokens, authentication state
- **cart**: Shopping cart items, totals, coupons
- **wishlist**: Favorite products (persisted to localStorage)
- **order**: Order history and management
- **address**: Saved shipping addresses

### Approach: Dedicated Wishlist Slice

The wishlist uses a dedicated NgRx slice (separate from user state) because:

- **Clear separation of concerns**: Wishlist has its own actions, effects, and persistence logic
- **Independent lifecycle**: Can be modified without user profile updates
- **Better performance**: Selective updates don't trigger user state changes
- **Reusable**: Can be accessed across multiple features without coupling to user module
