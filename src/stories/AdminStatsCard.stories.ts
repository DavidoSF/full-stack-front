import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { fn } from 'storybook/test';

interface StatCard {
  icon: string;
  label: string;
  value: number | string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
  iconBackground?: string;
}

@Component({
  selector: 'app-admin-stats-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stats-card" [class.clickable]="clickable" (click)="handleClick()">
      <div class="card-content">
        <div class="icon-container" [style.background]="iconBackground">
          <mat-icon [style.color]="iconColor">{{ icon }}</mat-icon>
        </div>
        <div class="stats-info">
          <span class="label">{{ label }}</span>
          <div class="value-container">
            <span class="value">{{ formattedValue }}</span>
            @if (trend) {
              <span
                class="trend"
                [class.positive]="trend.isPositive"
                [class.negative]="!trend.isPositive"
              >
                <mat-icon>{{ trend.isPositive ? 'trending_up' : 'trending_down' }}</mat-icon>
                {{ trend.value }}%
              </span>
            }
          </div>
          @if (subtitle) {
            <span class="subtitle">{{ subtitle }}</span>
          }
        </div>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .stats-card {
        padding: 24px;
        border-radius: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        min-width: 280px;

        &.clickable {
          cursor: pointer;

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          }
        }

        .card-content {
          display: flex;
          gap: 20px;
          align-items: flex-start;

          .icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            border-radius: 16px;
            flex-shrink: 0;
            transition: transform 0.3s ease;

            mat-icon {
              font-size: 32px;
              width: 32px;
              height: 32px;
            }
          }

          .stats-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex: 1;

            .label {
              font-size: 14px;
              font-weight: 500;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .value-container {
              display: flex;
              align-items: baseline;
              gap: 12px;

              .value {
                font-size: 32px;
                font-weight: 700;
                color: #1a1a1a;
                line-height: 1.2;
              }

              .trend {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 14px;
                font-weight: 600;
                padding: 4px 8px;
                border-radius: 8px;

                mat-icon {
                  font-size: 18px;
                  width: 18px;
                  height: 18px;
                }

                &.positive {
                  color: #4caf50;
                  background-color: #e8f5e9;
                }

                &.negative {
                  color: #f44336;
                  background-color: #ffebee;
                }
              }
            }

            .subtitle {
              font-size: 13px;
              color: #999;
              margin-top: 4px;
            }
          }
        }

        &:hover .icon-container {
          transform: scale(1.05);
        }
      }
    `,
  ],
})
class AdminStatsCardComponent {
  @Input() icon = 'insights';
  @Input() label = 'Statistic';
  @Input() value: number | string = 0;
  @Input() subtitle?: string;
  @Input() trend?: { value: number; isPositive: boolean };
  @Input() iconColor = '#fff';
  @Input() iconBackground = '#2196f3';
  @Input() clickable = false;
  @Input() formatAsCurrency = false;
  @Input() formatAsNumber = true;

  get formattedValue(): string {
    if (typeof this.value === 'string') {
      return this.value;
    }

    if (this.formatAsCurrency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(this.value);
    }

    if (this.formatAsNumber) {
      return new Intl.NumberFormat('en-US').format(this.value);
    }

    return String(this.value);
  }

  handleClick() {
    if (this.clickable) {
      console.log('Card clicked:', this.label);
    }
  }
}

const meta: Meta<AdminStatsCardComponent> = {
  component: AdminStatsCardComponent,
  title: 'Admin/StatsCard',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatCardModule, MatIconModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
    label: {
      control: 'text',
      description: 'Label/title of the statistic',
    },
    value: {
      control: 'number',
      description: 'The numeric value or text to display',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle or description',
    },
    trend: {
      control: 'object',
      description: 'Optional trend indicator with percentage and direction',
    },
    iconColor: {
      control: 'color',
      description: 'Color of the icon',
    },
    iconBackground: {
      control: 'color',
      description: 'Background color of the icon container',
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the card is clickable with hover effects',
    },
    formatAsCurrency: {
      control: 'boolean',
      description: 'Format value as currency',
    },
    formatAsNumber: {
      control: 'boolean',
      description: 'Format value with thousand separators',
    },
  },
};

export default meta;

type Story = StoryObj<AdminStatsCardComponent>;

export const TotalRevenue: Story = {
  args: {
    icon: 'attach_money',
    label: 'Total Revenue',
    value: 125840,
    subtitle: 'Last 30 days',
    trend: { value: 12.5, isPositive: true },
    iconColor: '#fff',
    iconBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    clickable: true,
    formatAsCurrency: true,
    formatAsNumber: false,
  },
};

export const TotalUsers: Story = {
  args: {
    icon: 'people',
    label: 'Total Users',
    value: 12450,
    subtitle: 'Active accounts',
    trend: { value: 8.2, isPositive: true },
    iconColor: '#fff',
    iconBackground: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    clickable: true,
    formatAsCurrency: false,
    formatAsNumber: true,
  },
};

export const TotalOrders: Story = {
  args: {
    icon: 'shopping_cart',
    label: 'Total Orders',
    value: 3842,
    subtitle: 'This month',
    trend: { value: 15.3, isPositive: true },
    iconColor: '#fff',
    iconBackground: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    clickable: true,
    formatAsCurrency: false,
    formatAsNumber: true,
  },
};

export const ProductsSold: Story = {
  args: {
    icon: 'inventory_2',
    label: 'Products Sold',
    value: 8924,
    subtitle: 'All time',
    iconColor: '#fff',
    iconBackground: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    clickable: false,
    formatAsCurrency: false,
    formatAsNumber: true,
  },
};

export const NegativeTrend: Story = {
  args: {
    icon: 'trending_down',
    label: 'Pending Orders',
    value: 42,
    subtitle: 'Requires attention',
    trend: { value: 5.5, isPositive: false },
    iconColor: '#fff',
    iconBackground: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    clickable: true,
    formatAsCurrency: false,
    formatAsNumber: true,
  },
};

export const NoTrend: Story = {
  args: {
    icon: 'star',
    label: 'Average Rating',
    value: '4.8',
    subtitle: 'Based on 2,341 reviews',
    iconColor: '#ffa726',
    iconBackground: '#fff3e0',
    clickable: false,
    formatAsCurrency: false,
    formatAsNumber: false,
  },
};

export const CustomColors: Story = {
  args: {
    icon: 'notifications',
    label: 'New Notifications',
    value: 28,
    subtitle: 'Unread messages',
    iconColor: '#fff',
    iconBackground: '#ff5722',
    clickable: true,
    formatAsCurrency: false,
    formatAsNumber: true,
  },
};

export const LargeValue: Story = {
  args: {
    icon: 'account_balance',
    label: 'Total Balance',
    value: 2458920,
    subtitle: 'Company account',
    trend: { value: 3.8, isPositive: true },
    iconColor: '#fff',
    iconBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    clickable: false,
    formatAsCurrency: true,
    formatAsNumber: false,
  },
};
