import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { fn } from 'storybook/test';

interface PromoDetails {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y';
  value?: number;
  description: string;
  minPurchase?: number;
  expiresAt?: string;
  itemsRequired?: number;
  itemsFree?: number;
}

@Component({
  selector: 'app-promo-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
  ],
  template: `
    <mat-card class="promo-summary-card" [class.applied]="isApplied">
      <div class="promo-header">
        <div class="promo-badge" [class]="promo.type">
          <mat-icon>{{ getPromoIcon() }}</mat-icon>
        </div>
        <div class="promo-info">
          <div class="promo-code">
            <span class="code-label">{{ promo.code }}</span>
            @if (isApplied) {
              <mat-chip class="applied-chip">
                <mat-icon>check_circle</mat-icon>
                Applied
              </mat-chip>
            }
          </div>
          <p class="promo-description">{{ promo.description }}</p>
        </div>
      </div>

      <mat-divider />

      <div class="promo-details">
        <div class="detail-row">
          <span class="detail-label">Discount Type:</span>
          <span class="detail-value">{{ getPromoTypeLabel() }}</span>
        </div>

        @if (promo.value) {
          <div class="detail-row">
            <span class="detail-label">Discount Value:</span>
            <span class="detail-value discount-value">{{ getDiscountDisplay() }}</span>
          </div>
        }

        @if (promo.minPurchase) {
          <div class="detail-row">
            <span class="detail-label">Minimum Purchase:</span>
            <span class="detail-value">{{ formatCurrency(promo.minPurchase) }}</span>
          </div>
        }

        @if (promo.itemsRequired && promo.itemsFree) {
          <div class="detail-row">
            <span class="detail-label">Offer:</span>
            <span class="detail-value"
              >Buy {{ promo.itemsRequired }}, Get {{ promo.itemsFree }} Free</span
            >
          </div>
        }

        @if (promo.expiresAt) {
          <div class="detail-row">
            <span class="detail-label">Expires:</span>
            <span class="detail-value expires">{{ formatDate(promo.expiresAt) }}</span>
          </div>
        }
      </div>

      @if (savingsAmount && savingsAmount > 0) {
        <div class="savings-banner">
          <mat-icon>savings</mat-icon>
          <span>You're saving {{ formatCurrency(savingsAmount) }}!</span>
        </div>
      }

      <mat-card-actions>
        @if (isApplied) {
          <button mat-stroked-button color="warn" (click)="handleRemovePromo()">
            <mat-icon>close</mat-icon>
            Remove
          </button>
        } @else {
          <button mat-raised-button color="primary" (click)="handleApplyPromo()">
            <mat-icon>redeem</mat-icon>
            Apply Promo
          </button>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .promo-summary-card {
        max-width: 500px;
        margin: 20px;
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;

        &.applied {
          border: 2px solid #4caf50;
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
        }

        .promo-header {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

          .promo-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 56px;
            height: 56px;
            border-radius: 12px;
            flex-shrink: 0;

            mat-icon {
              font-size: 32px;
              width: 32px;
              height: 32px;
              color: white;
            }

            &.percentage {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }

            &.fixed {
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            }

            &.free_shipping {
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            }

            &.buy_x_get_y {
              background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            }
          }

          .promo-info {
            flex: 1;

            .promo-code {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 8px;

              .code-label {
                font-size: 20px;
                font-weight: 700;
                font-family: 'Courier New', monospace;
                letter-spacing: 1px;
                color: #1a1a1a;
              }

              .applied-chip {
                display: flex;
                align-items: center;
                gap: 4px;
                height: 28px;
                padding: 0 12px;
                background-color: #4caf50;
                color: white;
                font-size: 12px;
                font-weight: 600;

                mat-icon {
                  font-size: 16px;
                  width: 16px;
                  height: 16px;
                }
              }
            }

            .promo-description {
              font-size: 14px;
              color: #666;
              margin: 0;
              line-height: 1.4;
            }
          }
        }

        .promo-details {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;

          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .detail-label {
              font-size: 14px;
              color: #666;
              font-weight: 500;
            }

            .detail-value {
              font-size: 14px;
              font-weight: 600;
              color: #1a1a1a;

              &.discount-value {
                color: #f5576c;
                font-size: 18px;
              }

              &.expires {
                color: #ff9800;
              }
            }
          }
        }

        .savings-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
          color: white;
          font-weight: 600;
          font-size: 16px;

          mat-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
          }
        }

        mat-card-actions {
          padding: 20px;
          display: flex;
          justify-content: center;

          button {
            width: 100%;
            height: 48px;
            font-size: 16px;
            font-weight: 600;

            mat-icon {
              margin-right: 8px;
            }
          }
        }
      }
    `,
  ],
})
class PromoSummaryComponent {
  @Input() promo!: PromoDetails;
  @Input() isApplied = false;
  @Input() savingsAmount?: number;
  @Output() onApplyPromo = new EventEmitter<PromoDetails>();
  @Output() onRemovePromo = new EventEmitter<PromoDetails>();

  getPromoIcon(): string {
    switch (this.promo.type) {
      case 'percentage':
        return 'percent';
      case 'fixed':
        return 'attach_money';
      case 'free_shipping':
        return 'local_shipping';
      case 'buy_x_get_y':
        return 'redeem';
      default:
        return 'card_giftcard';
    }
  }

  getPromoTypeLabel(): string {
    switch (this.promo.type) {
      case 'percentage':
        return 'Percentage Off';
      case 'fixed':
        return 'Fixed Amount Off';
      case 'free_shipping':
        return 'Free Shipping';
      case 'buy_x_get_y':
        return 'Buy X Get Y';
      default:
        return 'Discount';
    }
  }

  getDiscountDisplay(): string {
    if (!this.promo.value) return '';

    if (this.promo.type === 'percentage') {
      return `${this.promo.value}% OFF`;
    }

    if (this.promo.type === 'fixed') {
      return `${this.formatCurrency(this.promo.value)} OFF`;
    }

    return String(this.promo.value);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) return 'Expired';
    if (diffInDays === 0) return 'Expires Today';
    if (diffInDays === 1) return 'Expires Tomorrow';
    if (diffInDays < 7) return `Expires in ${diffInDays} days`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  handleApplyPromo() {
    this.onApplyPromo.emit(this.promo);
  }

  handleRemovePromo() {
    this.onRemovePromo.emit(this.promo);
  }
}

const meta: Meta<PromoSummaryComponent> = {
  component: PromoSummaryComponent,
  title: 'Shop/PromoSummary',
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatDividerModule,
      ],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    promo: {
      control: 'object',
      description: 'Promo code details object',
    },
    isApplied: {
      control: 'boolean',
      description: 'Whether the promo is currently applied',
    },
    savingsAmount: {
      control: 'number',
      description: 'Amount saved with this promo',
    },
    onApplyPromo: {
      action: 'apply-promo',
      description: 'Emitted when user clicks Apply Promo button',
    },
    onRemovePromo: {
      action: 'remove-promo',
      description: 'Emitted when user clicks Remove button',
    },
  },
};

export default meta;

type Story = StoryObj<PromoSummaryComponent>;

export const PercentageDiscount: Story = {
  args: {
    promo: {
      code: 'SAVE20',
      type: 'percentage',
      value: 20,
      description: 'Get 20% off your entire purchase!',
      minPurchase: 50,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    isApplied: false,
    onApplyPromo: fn(),
    onRemovePromo: fn(),
  },
};

export const FixedDiscount: Story = {
  args: {
    promo: {
      code: 'FIXED10',
      type: 'fixed',
      value: 10,
      description: 'Save $10 on orders over $75',
      minPurchase: 75,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    isApplied: false,
    savingsAmount: 10,
    onApplyPromo: fn(),
    onRemovePromo: fn(),
  },
};

export const FreeShipping: Story = {
  args: {
    promo: {
      code: 'FREESHIP',
      type: 'free_shipping',
      description: 'Enjoy free shipping on your order!',
      minPurchase: 25,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    isApplied: false,
    savingsAmount: 8.99,
    onApplyPromo: fn(),
    onRemovePromo: fn(),
  },
};

export const BuyXGetY: Story = {
  args: {
    promo: {
      code: 'BOGO',
      type: 'buy_x_get_y',
      description: 'Buy 2 items, get 1 free on selected products',
      itemsRequired: 2,
      itemsFree: 1,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    isApplied: false,
    onApplyPromo: fn(),
    onRemovePromo: fn(),
  },
};

export const AppliedPromo: Story = {
  args: {
    promo: {
      code: 'WELCOME25',
      type: 'percentage',
      value: 25,
      description: 'Welcome! Get 25% off your first order',
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    isApplied: true,
    savingsAmount: 37.5,
    onApplyPromo: fn(),
    onRemovePromo: fn(),
  },
};

export const LargeDiscount: Story = {
  args: {
    promo: {
      code: 'MEGA50',
      type: 'percentage',
      value: 50,
      description: 'MEGA SALE! 50% off everything - Limited time only!',
      minPurchase: 100,
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    isApplied: false,
    onApplyPromo: fn(),
    onRemovePromo: fn(),
  },
};

export const ExpiringToday: Story = {
  args: {
    promo: {
      code: 'HURRY15',
      type: 'percentage',
      value: 15,
      description: 'Last chance! 15% off expires today',
      minPurchase: 30,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    },
    isApplied: false,
    onApplyPromo: fn(),
    onRemovePromo: fn(),
  },
};

export const NoMinimum: Story = {
  args: {
    promo: {
      code: 'GIFT5',
      type: 'fixed',
      value: 5,
      description: 'Special gift: $5 off any purchase, no minimum required',
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    isApplied: false,
    savingsAmount: 5,
    onApplyPromo: fn(),
    onRemovePromo: fn(),
  },
};
