import { Routes } from '@angular/router';
import { ProductsPage } from './products-page/products-page';
import { ProductRatingPage } from './product-rating-page/product-rating-page';
import { ShopPage } from './shop-page';
import { CartPageComponent } from './cart/cart-page.component';
import { WishlistPageComponent } from './wishlist/wishlist-page.component';
import { ProductDetailsPageComponent } from './product-details/product-details-page.component';
import { Step1SummaryComponent } from './checkout/step1-summary.component';
import { Step2AddressComponent } from './checkout/step2-address.component';
import { Step3ConfirmComponent } from './checkout/step3-confirm.component';
import { OrdersPageComponent } from './orders/orders-page.component';
import { AddressPageComponent } from './address/address-page.component';
import { checkoutGuard } from '../../guards/checkout.guard';
import { checkoutAddressGuard } from '../../guards/checkout-address.guard';
import { checkoutConfirmGuard } from '../../guards/checkout-confirm.guard';

export const routes: Routes = [
  {
    path: '',
    component: ShopPage,
    children: [
      { path: 'products', component: ProductsPage },
      { path: 'products/:id', component: ProductDetailsPageComponent },
      { path: 'products/:id/rating', component: ProductRatingPage },
      { path: 'cart', component: CartPageComponent },
      { path: 'wishlist', component: WishlistPageComponent },
      { path: 'orders', component: OrdersPageComponent },
      { path: 'address', component: AddressPageComponent },
      {
        path: 'checkout',
        children: [
          { path: '', redirectTo: 'summary', pathMatch: 'full' },
          { path: 'summary', component: Step1SummaryComponent, canActivate: [checkoutGuard] },
          {
            path: 'address',
            component: Step2AddressComponent,
            canActivate: [checkoutAddressGuard],
          },
          {
            path: 'confirm',
            component: Step3ConfirmComponent,
            canActivate: [checkoutConfirmGuard],
          },
        ],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products',
      },
      { path: '**', redirectTo: 'products' },
    ],
  },
];
