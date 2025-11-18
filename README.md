# MyShop

An Angular shop application with authentication and product management.

## Features

- Authentication system with JWT tokens and refresh token handling
- Product catalog with filtering and ratings
- User dashboard
- NgRx state management
- Mock Service Worker for API mocking
- Storybook for component development
- Angular Material UI components

## Quick Start

Install dependencies:

```bash
npm install
```

- **Run the app**: `npm start` → `http://localhost:4200/`
- **Run Storybook**: `npm run storybook` → `http://localhost:6006/`
- **State management**: NgRx store lives in `src/app/store/` (global) and `src/app/components/*/state/` (feature-specific)
