import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Address } from '../app/components/shop-page/models/address.model';

@Component({
  selector: 'app-address-card-wrapper',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="address-card" [class.default]="isDefault">
      <mat-card-header>
        <mat-card-title>
          {{ address.firstName }} {{ address.lastName }}
          <span class="default-badge" *ngIf="isDefault">DEFAULT</span>
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p><mat-icon>email</mat-icon> {{ address.email }}</p>
        <p><mat-icon>phone</mat-icon> {{ address.phone }}</p>
        <p><mat-icon>location_on</mat-icon> {{ address.street }}</p>
        <p class="city-info">{{ address.city }}, {{ address.postalCode }}</p>
        <p>{{ address.country }}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="onSetDefault()" [disabled]="isDefault">
          <mat-icon>star</mat-icon>
          Set as Default
        </button>
        <button mat-button (click)="onEdit()">
          <mat-icon>edit</mat-icon>
          Edit
        </button>
        <button mat-button color="warn" (click)="onDelete()">
          <mat-icon>delete</mat-icon>
          Delete
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .address-card {
        max-width: 400px;
        margin: 16px;
        transition: all 0.3s;
      }

      .address-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .address-card.default {
        border: 2px solid #4caf50;
      }

      mat-card-content p {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 8px 0;
        color: #555;
      }

      mat-card-content mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #666;
      }

      .city-info {
        padding-left: 26px;
      }

      .default-badge {
        display: inline-block;
        background-color: #4caf50;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        margin-left: 12px;
      }

      mat-card-actions {
        display: flex;
        gap: 8px;
        padding: 16px;
      }

      mat-card-actions button {
        font-size: 13px;
      }
    `,
  ],
})
class AddressCardWrapper {
  @Input() address!: Address;
  @Input() isDefault = false;
  @Output() setDefault = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onSetDefault() {
    this.setDefault.emit();
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}

const meta: Meta<AddressCardWrapper> = {
  component: AddressCardWrapper,
  title: 'Shop/AddressCard',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    setDefault: { action: 'setDefault' },
    edit: { action: 'edit' },
    delete: { action: 'delete' },
  },
};

export default meta;

type Story = StoryObj<AddressCardWrapper>;

export const Default: Story = {
  args: {
    address: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      street: '123 Main Street',
      city: 'New York',
      postalCode: '10001',
      country: 'United States',
    },
    isDefault: false,
  },
};

export const DefaultAddress: Story = {
  args: {
    address: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      street: '456 Oak Avenue',
      city: 'San Francisco',
      postalCode: '94102',
      country: 'United States',
    },
    isDefault: true,
  },
};

export const EuropeanAddress: Story = {
  args: {
    address: {
      firstName: 'Pierre',
      lastName: 'Dupont',
      email: 'pierre.dupont@example.fr',
      phone: '+33 1 23 45 67 89',
      street: '12 Rue de la Paix',
      city: 'Paris',
      postalCode: '75002',
      country: 'France',
    },
    isDefault: false,
  },
};

export const LongAddress: Story = {
  args: {
    address: {
      firstName: 'Alexander',
      lastName: 'Richardson-Montgomery',
      email: 'alexander.richardson.montgomery@verylongemail.com',
      phone: '+44 20 1234 5678',
      street: '789 Westminster Boulevard, Apartment 42B, Building C',
      city: 'London',
      postalCode: 'SW1A 1AA',
      country: 'United Kingdom',
    },
    isDefault: false,
  },
};

export const AsianAddress: Story = {
  args: {
    address: {
      firstName: 'Yuki',
      lastName: 'Tanaka',
      email: 'yuki.tanaka@example.jp',
      phone: '+81 3-1234-5678',
      street: '1-2-3 Shibuya',
      city: 'Tokyo',
      postalCode: '150-0002',
      country: 'Japan',
    },
    isDefault: false,
  },
};

export const BusinessAddress: Story = {
  args: {
    address: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 555-0100',
      street: 'TechCorp Headquarters, 1000 Innovation Drive, Suite 500',
      city: 'Seattle',
      postalCode: '98101',
      country: 'United States',
    },
    isDefault: true,
  },
};

export const MinimalInfo: Story = {
  args: {
    address: {
      firstName: 'Bob',
      lastName: 'Lee',
      email: 'bob@example.com',
      phone: '555-0123',
      street: '1 Main St',
      city: 'LA',
      postalCode: '90001',
      country: 'USA',
    },
    isDefault: false,
  },
};
