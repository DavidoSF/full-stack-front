import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Address } from '../models/address.model';
import {
  selectCartSubtotal,
  selectCartTotal,
  selectCartDiscount,
  selectCartCouponCode,
  selectPromoCode,
  selectPromoDiscount,
  selectShipping,
  selectTaxes,
  selectAppliedPromos,
} from '../cart/state/cart.selectors';
import { selectSavedAddresses, selectDefaultAddress } from '../address/state/address.selectors';
import { AddressActions } from '../address/state/address.actions';

@Component({
  selector: 'app-step2-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './step2-address.component.html',
  styleUrls: ['./step2-address.component.scss'],
})
export class Step2AddressComponent implements OnInit {
  addressForm: FormGroup;
  subtotal$!: Observable<number>;
  total$!: Observable<number>;
  discount$!: Observable<number>;
  couponCode$!: Observable<string | undefined>;
  promoCode$!: Observable<string | undefined>;
  promoDiscount$!: Observable<number>;
  shipping$!: Observable<number>;
  taxes$!: Observable<number>;
  appliedPromos$!: Observable<string[]>;
  savedAddresses$!: Observable<Address[]>;
  defaultAddress$!: Observable<Address | null>;
  showForm = false;
  selectedAddress: Address | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
  ) {
    this.addressForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.subtotal$ = this.store.select(selectCartSubtotal);
    this.total$ = this.store.select(selectCartTotal);
    this.discount$ = this.store.select(selectCartDiscount);
    this.couponCode$ = this.store.select(selectCartCouponCode);
    this.promoCode$ = this.store.select(selectPromoCode);
    this.promoDiscount$ = this.store.select(selectPromoDiscount);
    this.shipping$ = this.store.select(selectShipping);
    this.taxes$ = this.store.select(selectTaxes);
    this.appliedPromos$ = this.store.select(selectAppliedPromos);
    this.savedAddresses$ = this.store.select(selectSavedAddresses);
    this.defaultAddress$ = this.store.select(selectDefaultAddress);

    this.store.dispatch(AddressActions.loadAddresses());

    this.savedAddresses$.subscribe((addresses) => {
      if (addresses.length === 0) {
        this.showForm = true;
      } else {
        this.defaultAddress$.subscribe((defaultAddr) => {
          if (defaultAddr) {
            this.selectedAddress = defaultAddr;
          }
        });
      }
    });
  }

  selectAddress(address: Address) {
    this.selectedAddress = address;
    this.showForm = false;
  }

  isSelectedAddress(address: Address): boolean {
    return (
      this.selectedAddress?.email === address.email &&
      this.selectedAddress?.street === address.street
    );
  }

  isDefaultAddress(address: Address): boolean {
    let isDefault = false;
    this.defaultAddress$.subscribe((defaultAddr) => {
      isDefault = defaultAddr?.email === address.email && defaultAddr?.street === address.street;
    });
    return isDefault;
  }

  useNewAddress() {
    this.showForm = true;
    this.selectedAddress = null;
  }

  goBack(): void {
    this.router.navigate(['/shop/checkout/summary']);
  }

  onSubmit(): void {
    let addressToUse: Address;

    if (this.selectedAddress) {
      addressToUse = this.selectedAddress;
    } else if (this.addressForm.valid) {
      addressToUse = this.addressForm.value;
    } else {
      return;
    }

    localStorage.setItem('checkout_address', JSON.stringify(addressToUse));
    this.router.navigate(['/shop/checkout/confirm']);
  }
}
