import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRatingPage } from './product-rating-page';

describe('ProductRatingPage', () => {
  let component: ProductRatingPage;
  let fixture: ComponentFixture<ProductRatingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRatingPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRatingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
