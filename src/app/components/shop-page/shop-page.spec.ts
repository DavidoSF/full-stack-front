import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ShopPage } from './shop-page';

describe('ShopPage', () => {
  let component: ShopPage;
  let fixture: ComponentFixture<ShopPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopPage],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
