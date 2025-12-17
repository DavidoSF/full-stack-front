import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Address } from '../models/address.model';
import { AddressActions } from './state/address.actions';
import { selectSavedAddresses, selectDefaultAddress } from './state/address.selectors';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-address-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './address-page.component.html',
  styleUrls: ['./address-page.component.scss'],
})
export class AddressPageComponent implements OnInit {
  addressForm: FormGroup;
  savedAddresses$!: Observable<Address[]>;
  defaultAddress$!: Observable<Address | null>;
  showForm = false;
  editingIndex: number | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private notificationService: NotificationService,
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
    this.savedAddresses$ = this.store.select(selectSavedAddresses);
    this.defaultAddress$ = this.store.select(selectDefaultAddress);
    this.store.dispatch(AddressActions.loadAddresses());
  }

  toggleAddressForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  saveAddress() {
    if (this.addressForm.valid) {
      const address: Address = this.addressForm.value;

      if (this.editingIndex !== null) {
        this.store.dispatch(AddressActions.updateAddress({ index: this.editingIndex, address }));
        this.notificationService.success('Address updated successfully!');
      } else {
        this.store.dispatch(AddressActions.addAddress({ address }));
        this.notificationService.success('Address saved successfully!');
      }

      this.resetForm();
      this.showForm = false;
    }
  }

  editAddress(index: number, address: Address) {
    this.editingIndex = index;
    this.addressForm.patchValue(address);
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteAddress(index: number) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.store.dispatch(AddressActions.removeAddress({ index }));
      this.notificationService.success('Address deleted successfully!');
    }
  }

  setAsDefault(address: Address) {
    let index = -1;
    this.savedAddresses$
      .subscribe((addresses) => {
        index = addresses.findIndex(
          (a) =>
            a.email === address.email && a.street === address.street && a.city === address.city,
        );
      })
      .unsubscribe();

    if (index >= 0) {
      this.store.dispatch(AddressActions.setDefaultAddress({ index, address }));
      this.notificationService.success('Default address updated!');
    }
  }

  isDefaultAddress(address: Address): boolean {
    let isDefault = false;
    this.defaultAddress$.subscribe((defaultAddr) => {
      isDefault = defaultAddr?.email === address.email && defaultAddr?.street === address.street;
    });
    return isDefault;
  }

  resetForm() {
    this.addressForm.reset();
    this.editingIndex = null;
  }
}
