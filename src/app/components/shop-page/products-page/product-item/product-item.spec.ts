import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductItem } from './product-item';
import { ProductModel } from '../../models/product.model';

describe('ProductItem', () => {
  let component: ProductItem;
  let fixture: ComponentFixture<ProductItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Product Data Rendering', () => {
    it('should render product name', () => {
      const mockProduct: ProductModel = {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        stock: 10,
        description: 'Test description',
        lowStockThreshold: 3,
        ratings: [],
        _avg: 4.5,
      };

      component.product = mockProduct;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Test Product');
    });

    it('should render product price', () => {
      const mockProduct: ProductModel = {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        stock: 10,
        description: 'Test description',
        lowStockThreshold: 3,
        ratings: [],
        _avg: 4.5,
      };

      component.product = mockProduct;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('99.99');
    });

    it('should handle undefined product gracefully', () => {
      component.product = undefined;
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('getStockStatus', () => {
    it('should return empty status when product is undefined', () => {
      component.product = undefined;
      const status = component.getStockStatus();

      expect(status.message).toBe('');
      expect(status.cssClass).toBe('');
    });

    it('should return "Out of stock" when stock is 0', () => {
      component.product = {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        stock: 0,
        description: 'Test',
        lowStockThreshold: 3,
        ratings: [],
        _avg: 4.5,
      };

      const status = component.getStockStatus();

      expect(status.message).toBe('Out of stock');
      expect(status.cssClass).toBe('out-of-stock');
    });

    it('should return "Only X left" when stock is low', () => {
      component.product = {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        stock: 2,
        description: 'Test',
        lowStockThreshold: 3,
        ratings: [],
        _avg: 4.5,
      };

      const status = component.getStockStatus();

      expect(status.message).toBe('Only 2 left');
      expect(status.cssClass).toBe('low-stock');
    });

    it('should return "In stock" when stock is above threshold', () => {
      component.product = {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        stock: 10,
        description: 'Test',
        lowStockThreshold: 3,
        ratings: [],
        _avg: 4.5,
      };

      const status = component.getStockStatus();

      expect(status.message).toBe('In stock');
      expect(status.cssClass).toBe('in-stock');
    });

    it('should return "Only X left" when stock equals threshold', () => {
      component.product = {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        stock: 3,
        description: 'Test',
        lowStockThreshold: 3,
        ratings: [],
        _avg: 4.5,
      };

      const status = component.getStockStatus();

      expect(status.message).toBe('Only 3 left');
      expect(status.cssClass).toBe('low-stock');
    });
  });

  describe('Product Input Changes', () => {
    it('should update display when product input changes', () => {
      const product1: ProductModel = {
        id: 1,
        name: 'Product 1',
        price: 50,
        stock: 10,
        description: 'First product',
        lowStockThreshold: 3,
        ratings: [],
        _avg: 4.0,
      };

      component.product = product1;
      fixture.detectChanges();

      let compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Product 1');

      const product2: ProductModel = {
        id: 2,
        name: 'Product 2',
        price: 100,
        stock: 5,
        description: 'Second product',
        lowStockThreshold: 2,
        ratings: [],
        _avg: 5.0,
      };

      component.product = product2;
      fixture.detectChanges();

      compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Product 2');
    });
  });
});
