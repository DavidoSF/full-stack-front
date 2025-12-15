/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { paginate, avgRating } from './utils';

const API = '/api';

// Store configuration
const storeConfig = {
  taxRate: 0.1, // 10% tax
  freeShippingThreshold: 50, // Free shipping above €50
  standardShippingFee: 5.99,
};

export const handlers = [
  // Store config: GET /api/config/ -> store configuration
  http.get(`${API}/config/`, () => {
    return HttpResponse.json(storeConfig, { status: 200 });
  }),

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
      .map((p) => ({
        ...p,
        _avg: avgRating(p.ratings),
        description: `High quality ${p.name.toLowerCase()} for all your needs`,
        promo: p.promo || null,
      }))
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
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        category: 'Office Supplies',
        promo: p.promo || null,
      },
      { status: 200 },
    );
  }),

  // Product reviews: GET /api/products/:id/reviews/ -> list of reviews
  http.get(`${API}/products/:id/reviews/`, async ({ params }) => {
    const productId = Number(params['id']);
    const reviewsKey = `msw_reviews_${productId}`;

    const reviews =
      typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(reviewsKey) || '[]') : [];

    return HttpResponse.json(reviews, { status: 200 });
  }),

  // Submit review: POST /api/products/:id/reviews/ -> create new review
  http.post(`${API}/products/:id/reviews/`, async ({ request, params }) => {
    const productId = Number(params['id']);
    const body = (await request.json()) as any;

    const currentUser =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('msw_current_user') || '{}')
        : { id: 'user-123', username: 'guest' };

    const reviewsKey = `msw_reviews_${productId}`;
    const reviews =
      typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(reviewsKey) || '[]') : [];

    const newReview = {
      id: `review-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      productId,
      userId: currentUser.id || 'user-123',
      username: currentUser.username || 'Guest',
      rating: body.rating,
      comment: body.comment,
      createdAt: new Date().toISOString(),
    };

    reviews.unshift(newReview);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(reviewsKey, JSON.stringify(reviews));
    }

    const product = products.find((p) => p.id === productId);
    if (product) {
      const uniqueUserId = Date.now() + Math.floor(Math.random() * 1000);

      product.ratings.push({ user_id: uniqueUserId, value: body.rating });
    }

    return HttpResponse.json(newReview, { status: 201 });
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

    const tax = subtotal * storeConfig.taxRate;
    const shipping =
      subtotal > storeConfig.freeShippingThreshold ? 0 : storeConfig.standardShippingFee;
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

  // Apply promo code: POST /api/cart/apply-promo/ -> price summary with promo
  http.post(`${API}/cart/apply-promo/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const items = body.items || [];
    const promoCode = (body.promoCode || '').toUpperCase();

    let itemsTotal = 0;
    items.forEach((item: any) => {
      const product = products.find((p) => p.id === item.product_id);
      const quantity = item.quantity || 1;
      const price = product ? product.price * quantity : 0;
      itemsTotal += price;
    });

    const promoCodes: {
      [key: string]: {
        type: 'percentage' | 'freeship' | 'conditional';
        value?: number;
        minAmount?: number;
      };
    } = {
      WELCOME10: { type: 'percentage', value: 10 },
      FREESHIP: { type: 'freeship' },
      VIP20: { type: 'conditional', value: 20, minAmount: 50 },
    };

    let discount = 0;
    let shipping =
      itemsTotal > storeConfig.freeShippingThreshold ? 0 : storeConfig.standardShippingFee;
    const appliedPromos: string[] = [];

    if (promoCode && promoCodes[promoCode]) {
      const promo = promoCodes[promoCode];

      if (promo.type === 'percentage') {
        discount = itemsTotal * (promo.value! / 100);
        appliedPromos.push(promoCode);
      } else if (promo.type === 'freeship') {
        shipping = 0;
        appliedPromos.push(promoCode);
      } else if (promo.type === 'conditional') {
        if (itemsTotal >= promo.minAmount!) {
          discount = itemsTotal * (promo.value! / 100);
          appliedPromos.push(promoCode);
        } else {
          return HttpResponse.json(
            {
              error: `Promo code ${promoCode} requires a minimum purchase of €${promo.minAmount}`,
            },
            { status: 400 },
          );
        }
      }
    } else if (promoCode) {
      return HttpResponse.json({ error: 'Invalid promo code' }, { status: 400 });
    }

    const subtotalAfterDiscount = itemsTotal - discount;
    const taxes = subtotalAfterDiscount * storeConfig.taxRate;
    const grandTotal = subtotalAfterDiscount + taxes + shipping;

    return HttpResponse.json(
      {
        itemsTotal: Number(itemsTotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        taxes: Number(taxes.toFixed(2)),
        grandTotal: Number(grandTotal.toFixed(2)),
        appliedPromos,
      },
      { status: 200 },
    );
  }),

  // Auto-apply promo: POST /api/cart/auto-promo/ -> automatically apply best promo
  http.post(`${API}/cart/auto-promo/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const items = body.items || [];

    let itemsTotal = 0;
    const cartProductIds: number[] = [];
    items.forEach((item: any) => {
      const product = products.find((p) => p.id === item.product_id);
      const quantity = item.quantity || 1;
      const price = product ? product.price * quantity : 0;
      itemsTotal += price;
      if (product) cartProductIds.push(product.id);
    });

    let discount = 0;
    let shipping =
      itemsTotal > storeConfig.freeShippingThreshold ? 0 : storeConfig.standardShippingFee;
    const appliedPromos: string[] = [];
    let promoCode = '';

    const hasPercentagePromo = items.some((item: any) => {
      const product = products.find((p) => p.id === item.product_id);
      return product?.promo?.type === 'percentage';
    });

    const hasFreeShippingPromo = items.some((item: any) => {
      const product = products.find((p) => p.id === item.product_id);
      return product?.promo?.type === 'free_shipping';
    });

    if (hasPercentagePromo) {
      const promoProduct = products.find(
        (p) => cartProductIds.includes(p.id) && p.promo?.type === 'percentage',
      );
      if (promoProduct?.promo?.value) {
        discount = itemsTotal * (promoProduct.promo.value / 100);
        promoCode = 'AUTO10';
        appliedPromos.push('AUTO10');
      }
    }

    if (hasFreeShippingPromo) {
      shipping = 0;
      if (!appliedPromos.includes('FREESHIP')) {
        promoCode = appliedPromos.length > 0 ? `${promoCode}+FREESHIP` : 'FREESHIP';
        appliedPromos.push('FREESHIP');
      }
    }

    if (itemsTotal >= storeConfig.freeShippingThreshold && !hasPercentagePromo) {
      discount = itemsTotal * storeConfig.taxRate;
      promoCode = 'VIP20';
      appliedPromos.push('VIP20');
    }

    const subtotalAfterDiscount = itemsTotal - discount;
    const taxes = subtotalAfterDiscount * storeConfig.taxRate;
    const grandTotal = subtotalAfterDiscount + taxes + shipping;

    return HttpResponse.json(
      {
        itemsTotal: Number(itemsTotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        taxes: Number(taxes.toFixed(2)),
        grandTotal: Number(grandTotal.toFixed(2)),
        appliedPromos,
        promoCode,
      },
      { status: 200 },
    );
  }),

  // Validate stock: POST /api/cart/validate-stock/ -> validate product availability
  http.post(`${API}/cart/validate-stock/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const items = body.items || [];

    const errors: string[] = [];

    items.forEach((item: any) => {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) {
        errors.push(`Product with ID ${item.product_id} not found`);
        return;
      }

      const requestedQuantity = item.quantity || 1;
      if (product.stock < requestedQuantity) {
        if (product.stock === 0) {
          errors.push(`Insufficient stock for product "${product.name}". Product is out of stock.`);
        } else {
          errors.push(
            `Insufficient stock for product "${product.name}". Only ${product.stock} available.`,
          );
        }
      }
    });

    if (errors.length > 0) {
      return HttpResponse.json(
        {
          error: errors.join(' '),
          errors: errors,
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({ message: 'Stock validation successful' }, { status: 200 });
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

    const itemsSubtotal = body.subtotal || 0;
    const discount = body.discount || 0;
    const shipping = body.shipping || 0;
    const tax = body.tax || 0;
    const total = body.total || 0;

    (body.items || []).forEach((item: any) => {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        product.stock = Math.max(0, product.stock - (item.quantity || 1));
      }
    });

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
      promo_code: body.promo_code || null,
      promo_discount: body.promo_discount ? Number(body.promo_discount.toFixed(2)) : 0,
      applied_promos: body.applied_promos || [],
      user_id: currentUser.id || 'user-123',
    };

    if (typeof window !== 'undefined') {
      const ordersKey = `msw_orders_${currentUser.id || 'user-123'}`;
      const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem(ordersKey, JSON.stringify(existingOrders));
      console.log(
        `[MSW Order] Saved order to ${ordersKey}. Total orders: ${existingOrders.length}`,
      );
      console.log('[MSW Order] Order details:', newOrder);
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
      typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(ordersKey) || '[]') : [];

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
      promoCode: order.promo_code || null,
      promoDiscount: order.promo_discount || 0,
      appliedPromos: order.applied_promos || [],
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
      typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(ordersKey) || '[]') : [];

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
        promoCode: order.promo_code || null,
        promoDiscount: order.promo_discount || 0,
        appliedPromos: order.applied_promos || [],
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
      typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(ordersKey) || '[]') : [];

    const cancelledOrder = orders.find((o: any) => o.order_id === orderId);
    if (cancelledOrder && cancelledOrder.items) {
      cancelledOrder.items.forEach((item: any) => {
        const product = products.find((p) => p.id === (item.productId || item.product_id));
        if (product) {
          product.stock += item.quantity || 1;
        }
      });
    }

    const updatedOrders = orders.filter((o: any) => o.order_id !== orderId);

    if (typeof window !== 'undefined') {
      localStorage.setItem(ordersKey, JSON.stringify(updatedOrders));
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

  // Admin stats: GET /api/admin/stats/ -> dashboard statistics
  http.get(`${API}/admin/stats/`, async () => {
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalProductsSold = 0;
    const uniqueUsers = new Set<string>();
    const productSales: Record<string, { name: string; sold: number; revenue: number }> = {};
    const recentOrdersList: any[] = [];

    console.log('debg;  Fetching admin statistics...');

    if (typeof window !== 'undefined') {
      console.log('debg;  LocalStorage length:', localStorage.length);

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log('debg;  Checking key:', key);

        if (key && key.startsWith('msw_orders_')) {
          const userId = key.replace('msw_orders_', '');
          uniqueUsers.add(userId);

          const orders = JSON.parse(localStorage.getItem(key) || '[]');
          console.log(`[MSW Admin Stats] Found ${orders.length} orders for user ${userId}`);
          totalOrders += orders.length;

          orders.forEach((order: any) => {
            totalRevenue += order.total || 0;

            let userName = 'Unknown User';
            if (order.user_id) {
              const currentUser = JSON.parse(localStorage.getItem('msw_current_user') || '{}');
              if (currentUser.id === order.user_id) {
                userName = currentUser.email || currentUser.username || order.user_id;
              } else {
                userName = order.user_id;
              }
            }

            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item: any) => {
                const productId = String(item.product_id || item.productId);
                const quantity = item.quantity || 1;
                const itemPrice = item.price || 0;

                totalProductsSold += quantity;

                const product = products.find((p) => p.id === Number(productId));
                if (product) {
                  if (!productSales[productId]) {
                    productSales[productId] = { name: product.name, sold: 0, revenue: 0 };
                  }
                  productSales[productId].sold += quantity;
                  productSales[productId].revenue += itemPrice * quantity;
                }
              });
            }

            recentOrdersList.push({
              id: order.order_id || order.orderId,
              user: userName,
              total: order.total || 0,
              createdAt: order.created_at || new Date().toISOString(),
              status: order.status || 'pending',
            });
          });
        }
      }

      if (localStorage.getItem('msw_current_user')) {
        const currentUser = JSON.parse(localStorage.getItem('msw_current_user') || '{}');
        if (currentUser.id) {
          uniqueUsers.add(currentUser.id);
        }
      }
    }

    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => ({
        productId,
        name: data.name,
        sold: data.sold,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const recentOrders = recentOrdersList
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const stats = {
      totalUsers: uniqueUsers.size,
      totalOrders,
      totalRevenue,
      totalProductsSold,
      topProducts,
      recentOrders,
    };

    console.log('debg;  Returning stats:', stats);
    return HttpResponse.json(stats, { status: 200 });
  }),
];
