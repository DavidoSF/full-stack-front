import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductRatingPage } from './product-rating-page';

describe('ProductRatingPage', () => {
  let component: ProductRatingPage;
  let fixture: ComponentFixture<ProductRatingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRatingPage],
      providers: [
        provideMockStore({
          initialState: {
            reviews: {
              reviews: [],
              loading: false,
              error: null,
              currentProductId: null,
              filterRating: null,
              sortBy: 'recent',
            },
          },
        }),
        {
          provide: ActivatedRoute,
          useValue: { params: of({}), snapshot: { params: {}, paramMap: { get: () => null } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRatingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
