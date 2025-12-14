/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { paginate, avgRating } from './utils';

const API = '/api';

export const handlers = [
  // Auth: POST /api/auth/token/ -> { access, refresh, user }
  http.post(`${API}/auth/token/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const username = body.username || 'user';

    // Check if user data already exists in sessionStorage
    const existingUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : {};

    // Store user session in sessionStorage for MSW
    const userData = {
      id: existingUser.id || 'user-' + username,
      username: username,
      email: existingUser.email || `${username}@example.com`,
      fullName: existingUser.fullName || username.charAt(0).toUpperCase() + username.slice(1),
      defaultAddress: existingUser.defaultAddress || null,
      addresses: existingUser.addresses || [],
      preferences: existingUser.preferences || {
        newsletter: true,
        defaultMinRating: 0,
      },
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('msw_current_user', JSON.stringify(userData));
    }

    return HttpResponse.json(
      {
        access: 'mock-access-token-' + username,
        refresh: 'mock-refresh-token-' + username,
        user: userData,
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
        name: product?.name || 'Product',
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

    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : { id: 'user-123' };

    const enrichedItems = (body.items || []).map((item: any) => {
      const productId = Number(item.product_id);
      const product = products.find((p) => p.id === productId);

      console.log('MSW Order: Looking for product', productId, 'found:', product?.name);

      return {
        product_id: productId,
        productId: productId,
        name: product?.name || `Unknown Product (ID: ${productId})`,
        price: product?.price || 0,
        quantity: item.quantity || 1,
      };
    });

    const itemsSubtotal = enrichedItems.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);
    const discount = body.coupon_code ? itemsSubtotal * 0.1 : 0;
    const shipping = itemsSubtotal > 50 ? 0 : 5.99;
    const tax = (itemsSubtotal - discount) * 0.2;
    const total = itemsSubtotal - discount + shipping + tax;

    const newOrder = {
      order_id: orderId,
      confirmation_number: orderId,
      status: 'confirmed',
      created_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      subtotal: Number(itemsSubtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      items: enrichedItems,
      shipping_address: body.shipping_address || {},
      coupon_code: body.coupon_code || null,
      user_id: currentUser.id || 'user-123',
    };

    if (typeof window !== 'undefined') {
      const ordersKey = `msw_orders_${currentUser.id || 'user-123'}`;
      const existingOrders = JSON.parse(sessionStorage.getItem(ordersKey) || '[]');
      existingOrders.unshift(newOrder);
      sessionStorage.setItem(ordersKey, JSON.stringify(existingOrders));
    }

    return HttpResponse.json(
      {
        order_id: orderId,
        confirmation_number: orderId,
        status: 'confirmed',
        created_at: newOrder.created_at,
        estimated_delivery: newOrder.estimated_delivery,
        total: newOrder.total,
        message: 'Your order has been successfully placed!',
      },
      { status: 201 },
    );
  }),

  // User profile: GET /api/me/ -> user profile and preferences
  http.get(`${API}/me/`, async () => {
    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : {
            id: 'user-123',
            username: 'user',
            email: 'user@example.com',
            fullName: 'User',
            defaultAddress: null,
            addresses: [],
            preferences: { newsletter: true, defaultMinRating: 0 },
          };

    const addressesKey = `msw_addresses_${currentUser.id || 'user-123'}`;
    const defaultKey = `msw_default_address_${currentUser.id || 'user-123'}`;
    const addresses =
      typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(addressesKey) || '[]') : [];
    const defaultAddress =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem(defaultKey) || 'null')
        : null;

    return HttpResponse.json(
      {
        id: currentUser.id || 'user-123',
        username: currentUser.username || 'user',
        email: currentUser.email || 'user@example.com',
        fullName: currentUser.fullName || 'User',
        defaultAddress: defaultAddress,
        addresses: addresses,
        preferences: currentUser.preferences || {
          newsletter: true,
          defaultMinRating: 0,
        },
        orders: [],
      },
      { status: 200 },
    );
  }),

  // Update user profile: PATCH /api/me/ -> updated user
  http.patch(`${API}/me/`, async ({ request }) => {
    const body = (await request.json()) as any;

    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : {
            id: 'user-123',
            username: 'user',
            email: 'user@example.com',
            fullName: 'User',
            defaultAddress: null,
            addresses: [],
            preferences: { newsletter: true, defaultMinRating: 0 },
          };

    const updatedUser = {
      ...currentUser,
      fullName: body.fullName !== undefined ? body.fullName : currentUser.fullName,
      defaultAddress:
        body.defaultAddress !== undefined ? body.defaultAddress : currentUser.defaultAddress,
      addresses: body.addresses !== undefined ? body.addresses : currentUser.addresses,
      preferences: body.preferences !== undefined ? body.preferences : currentUser.preferences,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('msw_current_user', JSON.stringify(updatedUser));
    }

    return HttpResponse.json(
      {
        id: updatedUser.id || 'user-123',
        username: updatedUser.username || 'user',
        email: updatedUser.email || 'user@example.com',
        fullName: updatedUser.fullName || 'User',
        defaultAddress: updatedUser.defaultAddress || null,
        addresses: updatedUser.addresses || [],
        preferences: updatedUser.preferences || {
          newsletter: true,
          defaultMinRating: 0,
        },
        orders: [],
      },
      { status: 200 },
    );
  }),

  // User addresses: GET /api/me/addresses/ -> user's saved addresses
  http.get(`${API}/me/addresses/`, async () => {
    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : { id: 'user-123' };

    const addressesKey = `msw_addresses_${currentUser.id || 'user-123'}`;
    const defaultKey = `msw_default_address_${currentUser.id || 'user-123'}`;

    const addresses =
      typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(addressesKey) || '[]') : [];
    const defaultAddress =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem(defaultKey) || 'null')
        : null;

    return HttpResponse.json(
      {
        addresses,
        defaultAddress,
      },
      { status: 200 },
    );
  }),

  // Add address: POST /api/me/addresses/ -> add new address
  http.post(`${API}/me/addresses/`, async ({ request }) => {
    const body = (await request.json()) as any;

    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : { id: 'user-123' };

    const addressesKey = `msw_addresses_${currentUser.id || 'user-123'}`;
    const addresses =
      typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(addressesKey) || '[]') : [];

    addresses.push(body);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(addressesKey, JSON.stringify(addresses));
    }

    return HttpResponse.json({ message: 'Address added successfully' }, { status: 201 });
  }),

  // Update address: PUT /api/me/addresses/:index/ -> update address at index
  http.put(`${API}/me/addresses/:index/`, async ({ request, params }) => {
    const body = (await request.json()) as any;
    const index = Number(params['index']);

    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : { id: 'user-123' };

    const addressesKey = `msw_addresses_${currentUser.id || 'user-123'}`;
    const addresses =
      typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(addressesKey) || '[]') : [];

    if (index >= 0 && index < addresses.length) {
      addresses[index] = body;

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(addressesKey, JSON.stringify(addresses));
      }

      return HttpResponse.json({ message: 'Address updated successfully' }, { status: 200 });
    }

    return HttpResponse.json({ error: 'Address not found' }, { status: 404 });
  }),

  // Delete address: DELETE /api/me/addresses/:index/ -> remove address at index
  http.delete(`${API}/me/addresses/:index/`, async ({ params }) => {
    const index = Number(params['index']);

    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : { id: 'user-123' };

    const addressesKey = `msw_addresses_${currentUser.id || 'user-123'}`;
    const addresses =
      typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(addressesKey) || '[]') : [];

    if (index >= 0 && index < addresses.length) {
      addresses.splice(index, 1);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(addressesKey, JSON.stringify(addresses));
      }

      return HttpResponse.json({ message: 'Address deleted successfully' }, { status: 200 });
    }

    return HttpResponse.json({ error: 'Address not found' }, { status: 404 });
  }),

  // Set default address: PATCH /api/me/addresses/default/ -> set address as default
  http.patch(`${API}/me/addresses/default/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const index = Number(body.index);

    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : { id: 'user-123' };

    const addressesKey = `msw_addresses_${currentUser.id || 'user-123'}`;
    const defaultKey = `msw_default_address_${currentUser.id || 'user-123'}`;
    const addresses =
      typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(addressesKey) || '[]') : [];

    if (index >= 0 && index < addresses.length) {
      const defaultAddress = addresses[index];

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(defaultKey, JSON.stringify(defaultAddress));
      }

      return HttpResponse.json({ message: 'Default address set successfully' }, { status: 200 });
    }

    return HttpResponse.json({ error: 'Address not found' }, { status: 404 });
  }),

  // User orders list: GET /api/me/orders/ -> list of user orders
  http.get(`${API}/me/orders/`, async () => {
    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : { id: 'user-123' };

    const ordersKey = `msw_orders_${currentUser.id || 'user-123'}`;
    const orders =
      typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(ordersKey) || '[]') : [];

    const transformedOrders = orders.map((order: any) => ({
      orderId: order.order_id,
      confirmationNumber: order.confirmation_number,
      status: order.status,
      createdAt: order.created_at,
      estimatedDelivery: order.estimated_delivery,
      items: order.items || [],
      shippingAddress: {
        firstName: order.shipping_address?.first_name || '',
        lastName: order.shipping_address?.last_name || '',
        email: order.shipping_address?.email || '',
        phone: order.shipping_address?.phone || '',
        street: order.shipping_address?.street || '',
        city: order.shipping_address?.city || '',
        postalCode: order.shipping_address?.postal_code || '',
        country: order.shipping_address?.country || '',
      },
      subtotal: order.subtotal || 0,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      discount: order.discount || 0,
      total: order.total || 0,
      couponCode: order.coupon_code || null,
    }));

    return HttpResponse.json(transformedOrders, { status: 200 });
  }),

  // Order details: GET /api/orders/:id/ -> full order details
  http.get(`${API}/orders/:id/`, async ({ params }) => {
    const orderId = params['id'] as string;

    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : { id: 'user-123' };

    const ordersKey = `msw_orders_${currentUser.id || 'user-123'}`;
    const orders =
      typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(ordersKey) || '[]') : [];

    const order = orders.find((o: any) => o.order_id === orderId);

    if (!order) {
      return HttpResponse.json({ detail: 'Order not found' }, { status: 404 });
    }

    return HttpResponse.json(
      {
        orderId: order.order_id,
        confirmationNumber: order.confirmation_number,
        status: order.status,
        items: order.items.map((item: any) => ({
          productId: item.productId || item.product_id,
          name: item.name || 'Product',
          price: item.price || 0,
          quantity: item.quantity || 1,
        })),
        shippingAddress: {
          firstName: order.shipping_address?.first_name || '',
          lastName: order.shipping_address?.last_name || '',
          email: order.shipping_address?.email || '',
          phone: order.shipping_address?.phone || '',
          street: order.shipping_address?.street || '',
          city: order.shipping_address?.city || '',
          postalCode: order.shipping_address?.postal_code || '',
          country: order.shipping_address?.country || '',
        },
        subtotal: order.subtotal || 0,
        tax: order.tax || 0,
        shipping: order.shipping || 0,
        discount: order.discount || 0,
        total: order.total || 0,
        couponCode: order.coupon_code || null,
        createdAt: order.created_at,
        estimatedDelivery: order.estimated_delivery,
      },
      { status: 200 },
    );
  }),

  // Cancel order: DELETE /api/orders/:id/ -> success message
  http.delete(`${API}/orders/:id/`, async ({ params }) => {
    const orderId = params['id'] as string;

    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : { id: 'user-123' };

    const ordersKey = `msw_orders_${currentUser.id || 'user-123'}`;
    const orders =
      typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(ordersKey) || '[]') : [];

    const updatedOrders = orders.filter((o: any) => o.order_id !== orderId);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(ordersKey, JSON.stringify(updatedOrders));
    }

    return HttpResponse.json({ message: 'Order cancelled successfully' }, { status: 200 });
  }),

  // User wishlist: GET /api/me/wishlist/ -> list of product IDs
  http.get(`${API}/me/wishlist/`, async () => {
    return HttpResponse.json(['1', '3', '5'], { status: 200 });
  }),

  // Update wishlist: POST /api/me/wishlist/ -> updated wishlist
  http.post(`${API}/me/wishlist/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const { productId, action } = body;

    const currentWishlist = ['1', '3', '5'];
    let updatedWishlist = [...currentWishlist];

    if (action === 'add' && !updatedWishlist.includes(productId)) {
      updatedWishlist.push(productId);
    } else if (action === 'remove') {
      updatedWishlist = updatedWishlist.filter((id) => id !== productId);
    }

    return HttpResponse.json({ wishlist: updatedWishlist }, { status: 200 });
  }),
];
