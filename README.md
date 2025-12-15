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

## Architecture & Technical Decisions

### State Management Architecture

**NgRx with Feature Slices**

- Each major feature (user, auth, cart, wishlist, order, address, admin, reviews) has its own NgRx slice
- **Rationale**: Modular, scalable, and easier to maintain than a monolithic store
- Each slice contains: state interface, actions, reducer, selectors, and effects

**Selector Strategy**

- Memoized selectors for computed values (e.g., cart totals, filtered reviews, rating distribution)
- **Rationale**: Prevents unnecessary recalculations and component re-renders
- Complex selectors (e.g., `selectFilteredSortedReviews`) compose simpler selectors for maintainability

### Data Persistence

**localStorage for Client-Side State**

- Cart items and wishlist persisted to localStorage via NgRx effects
- **Rationale**: Maintains user state across sessions without server calls
- Rehydrated on app initialization through `APP_INITIALIZER`

**sessionStorage for Mock Data**

- MSW mock handlers use sessionStorage for reviews (`msw_reviews_${productId}`)
- **Rationale**: Simulates backend persistence during development without affecting production code
- Cleared on app load to ensure fresh state

### API & Mocking Strategy

**MSW (Mock Service Worker)**

- Intercepts HTTP requests at the network level
- **Rationale**:
  - No code changes needed between mock and real API
  - Works in both browser and Storybook
  - Enables full-stack development without backend dependency
  - Realistic testing with network delays

**Endpoints**: `/api/auth/`, `/api/products/`, `/api/cart/`, `/api/orders/`, `/api/addresses/`, `/api/reviews/`, `/api/admin/stats/`

### Security & Authentication

**JWT with Refresh Tokens**

- Access token (15min) + refresh token (7 days)
- **Rationale**: Balance between security and user experience

**HTTP Interceptor**

- Automatically attaches tokens to protected requests
- Handles token refresh on 401 errors
- **Rationale**: Centralized auth logic, no manual token handling in components

**Route Guards**

- `AuthGuard`: Protects authenticated routes
- `AlreadyAuthenticatedGuard`: Redirects logged-in users from login page
- **Rationale**: Declarative route protection, consistent UX

### Component Architecture

**Smart vs. Presentational Pattern**

- **Smart Components**: Connected to NgRx store, handle business logic (e.g., `cart-page.component.ts`)
- **Presentational Components**: Receive data via `@Input()`, emit events via `@Output()` (e.g., `cart-item.component.ts`)
- **Rationale**: Reusability, testability, clear separation of concerns

**Material Design System**

- Angular Material for UI components
- Custom theme in `custom-theme.scss`
- **Rationale**: Consistent design language, accessibility, mobile-responsive out of the box

### Routing Strategy

**Lazy Loading by Feature**

- Account, Admin, Shop routes loaded on demand
- **Rationale**: Faster initial load, better code splitting, reduced bundle size

**Route Structure**

- Hierarchical: `/shop/products/:id`, `/account/orders/:id`
- **Rationale**: RESTful conventions, intuitive navigation, bookmarkable URLs

### Reviews & Ratings Synchronization

**Real-time Rating Updates**

- When review submitted → product ratings array updates → effects dispatch multiple actions
- **Rationale**: Ensures UI stays consistent across product list, details, and review pages
- Actions chain: `submitReviewSuccess` → `loadReviews` → `loadProductRating` → `loadProducts`

### Development Tools

**Storybook Integration**

- Component documentation with isolated stories
- **Rationale**: Visual testing, component library, design system documentation
- Works with MSW for realistic data scenarios
