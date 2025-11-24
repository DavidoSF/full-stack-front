/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { paginate, avgRating } from './utils';

const API = '/api';

export const handlers = [
  // Auth: POST /api/auth/token/ -> { access, refresh }
  http.post(`${API}/auth/token/`, async () => {
    // Ici on accepte tout payload pour valider l'intégration front.
    return HttpResponse.json(
      {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      },
      { status: 200 },
    );
  }),

  // Auth refresh: POST /api/auth/token/refresh/ -> { access }
  http.post(`${API}/auth/token/refresh/`, async () => {
    return HttpResponse.json({ access: 'mock-access-token-refreshed' }, { status: 200 });
  }),

  // Products list: GET /api/products/?page=&page_size=&min_rating=&ordering=
  http.get(`${API}/products/`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const page_size = Number(url.searchParams.get('page_size') || '10');
    const min_rating = Number(url.searchParams.get('min_rating') || '0');
    const ordering = url.searchParams.get('ordering') || '-created_at';

    const rows = products
      .map((p) => ({ ...p, _avg: avgRating(p.ratings) }))
      .filter((p) => p._avg >= min_rating);

    const sign = ordering.startsWith('-') ? -1 : 1;
    const key = ordering.replace(/^-/, '');
    rows.sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign);

    const { count, results } = paginate(rows, page, page_size);
    return HttpResponse.json({ count, next: null, previous: null, results }, { status: 200 });
  }),

  // Product rating: GET /api/products/:id/rating/
  http.get(`${API}/products/:id/rating/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(
      { product_id: id, avg_rating: avgRating(p.ratings), count: p.ratings.length },
      { status: 200 },
    );
  }),

  // Product details: GET /api/products/:id/ -> full product details
  http.get(`${API}/products/:id/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });

    return HttpResponse.json(
      {
        id: p.id,
        name: p.name,
        price: p.price,
        created_at: p.created_at,
        owner_id: p.owner_id,
        avg_rating: avgRating(p.ratings),
        ratings_count: p.ratings.length,
        description: `Detailed description for ${p.name}`,
        stock: Math.floor(Math.random() * 100) + 10,
        category: 'Office Supplies',
      },
      { status: 200 },
    );
  }),

  // Cart validation: POST /api/cart/validate/ -> price summary
  http.post(`${API}/cart/validate/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const items = body.items || [];

    let subtotal = 0;
    const validatedItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.product_id);
      const quantity = item.quantity || 1;
      const price = product ? product.price * quantity : 0;
      subtotal += price;

      return {
        product_id: item.product_id,
        quantity,
        unit_price: product?.price || 0,
        total_price: price,
        available: !!product,
      };
    });

    const tax = subtotal * 0.2; // 20% tax
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;

    return HttpResponse.json(
      {
        items: validatedItems,
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        total: Number(total.toFixed(2)),
        currency: 'EUR',
      },
      { status: 200 },
    );
  }),

  // Order creation: POST /api/order/ -> order confirmation
  http.post(`${API}/order/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    return HttpResponse.json(
      {
        order_id: orderId,
        confirmation_number: orderId,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        total: body.total || 0,
        message: 'Your order has been successfully placed!',
      },
      { status: 201 },
    );
  }),
];
