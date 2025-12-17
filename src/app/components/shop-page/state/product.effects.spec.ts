import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { ProductEffects } from './product.effects';
import { ProductService } from '../services/product.service';
import { ProductActions } from './product.actions';
import { NotificationService } from '../../../shared/services/notification.service';

describe('Product Effects', () => {
  let actions$: Observable<any>;
  let effects: ProductEffects;
  let productService: jasmine.SpyObj<ProductService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'getProductRating',
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'error',
      'success',
      'warning',
      'info',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProductEffects,
        provideMockActions(() => actions$),
        { provide: ProductService, useValue: productServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    effects = TestBed.inject(ProductEffects);
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    notificationService = TestBed.inject(
      NotificationService,
    ) as jasmine.SpyObj<NotificationService>;
  });

  describe('loadProducts$', () => {
    it('should return loadProductsSuccess on successful API call', (done) => {
      const params = { page: 1, page_size: 10 };
      const mockResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            name: 'Product 1',
            price: 50,
            stock: 10,
            description: 'Test product 1',
            lowStockThreshold: 3,
            ratings: [],
            _avg: 4.5,
          },
          {
            id: 2,
            name: 'Product 2',
            price: 100,
            stock: 5,
            description: 'Test product 2',
            lowStockThreshold: 2,
            ratings: [],
            _avg: 4.0,
          },
        ],
      };

      productService.getProducts.and.returnValue(of(mockResponse));

      actions$ = of(ProductActions.loadProducts({ params }));

      effects.loadProducts$.subscribe((action) => {
        expect(action.type).toBe(ProductActions.loadProductsSuccess.type);
        if (action.type === ProductActions.loadProductsSuccess.type) {
          expect(action.products).toEqual(mockResponse.results);
          expect(action.count).toBe(2);
        }
        expect(productService.getProducts).toHaveBeenCalledWith(params);
        done();
      });
    });

    it('should return loadProductsFailure on API error', (done) => {
      const params = { page: 1 };
      const error = new Error('Network error');

      productService.getProducts.and.returnValue(throwError(() => error));

      actions$ = of(ProductActions.loadProducts({ params }));

      effects.loadProducts$.subscribe((action) => {
        expect(action.type).toBe(ProductActions.loadProductsFailure.type);
        if (action.type === ProductActions.loadProductsFailure.type) {
          expect(action.error).toBe(error);
        }
        done();
      });
    });

    it('should handle empty response', (done) => {
      const params = {};
      const mockResponse = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };

      productService.getProducts.and.returnValue(of(mockResponse));

      actions$ = of(ProductActions.loadProducts({ params }));

      effects.loadProducts$.subscribe((action) => {
        expect(action.type).toBe(ProductActions.loadProductsSuccess.type);
        if (action.type === ProductActions.loadProductsSuccess.type) {
          expect(action.products).toEqual([]);
          expect(action.count).toBe(0);
        }
        done();
      });
    });

    it('should handle different filter parameters', (done) => {
      const params = { page: 2, page_size: 20, min_rating: 4, ordering: '-price' };
      const mockResponse = {
        count: 1,
        next: null,
        previous: '/api/products/?page=1',
        results: [
          {
            id: 3,
            name: 'Product 3',
            price: 200,
            stock: 15,
            description: 'Test product 3',
            lowStockThreshold: 5,
            ratings: [],
            _avg: 4.8,
          },
        ],
      };

      productService.getProducts.and.returnValue(of(mockResponse));

      actions$ = of(ProductActions.loadProducts({ params }));

      effects.loadProducts$.subscribe((action) => {
        expect(action.type).toBe(ProductActions.loadProductsSuccess.type);
        expect(productService.getProducts).toHaveBeenCalledWith(params);
        done();
      });
    });
  });

  describe('loadProductsFailure$', () => {
    it('should show error notification on product load failure', (done) => {
      const error = new Error('Failed to load');

      actions$ = of(ProductActions.loadProductsFailure({ error }));

      effects.loadProductsFailure$.subscribe(() => {
        expect(notificationService.error).toHaveBeenCalledWith(
          'Failed to load products. Please try again.',
        );
        done();
      });
    });
  });

  describe('loadProductRating$', () => {
    it('should return loadProductRatingSuccess on successful API call', (done) => {
      const productId = 1;
      const mockRating = {
        product_id: 1,
        avg_rating: 4.5,
        count: 10,
        ratings: [5, 4, 5, 4, 5, 4, 5, 4, 4, 5],
      };

      productService.getProductRating.and.returnValue(of(mockRating));

      actions$ = of(ProductActions.loadProductRating({ id: productId }));

      effects.loadProductRating$.subscribe((action) => {
        expect(action.type).toBe(ProductActions.loadProductRatingSuccess.type);
        if (action.type === ProductActions.loadProductRatingSuccess.type) {
          expect(action.product_id).toBe(1);
          expect(action.avg_rating).toBe(4.5);
          expect(action.count).toBe(10);
        }
        expect(productService.getProductRating).toHaveBeenCalledWith(productId);
        done();
      });
    });

    it('should return loadProductRatingFailure on API error', (done) => {
      const productId = 1;
      const error = new Error('Rating not found');

      productService.getProductRating.and.returnValue(throwError(() => error));

      actions$ = of(ProductActions.loadProductRating({ id: productId }));

      effects.loadProductRating$.subscribe((action) => {
        expect(action.type).toBe(ProductActions.loadProductRatingFailure.type);
        if (action.type === ProductActions.loadProductRatingFailure.type) {
          expect(action.error).toBe(error);
        }
        done();
      });
    });

    it('should handle rating response without ratings array', (done) => {
      const productId = 2;
      const mockRating = {
        product_id: 2,
        avg_rating: 3.5,
        count: 5,
      };

      productService.getProductRating.and.returnValue(of(mockRating));

      actions$ = of(ProductActions.loadProductRating({ id: productId }));

      effects.loadProductRating$.subscribe((action) => {
        expect(action.type).toBe(ProductActions.loadProductRatingSuccess.type);
        if (action.type === ProductActions.loadProductRatingSuccess.type) {
          expect(action.ratings).toEqual([]);
        }
        done();
      });
    });
  });
});
