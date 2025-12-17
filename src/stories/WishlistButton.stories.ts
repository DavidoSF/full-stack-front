import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fn } from 'storybook/test';

@Component({
  selector: 'app-wishlist-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button
      mat-icon-button
      [class.active]="isInWishlist"
      [disabled]="loading"
      (click)="handleToggle()"
      [matTooltip]="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
      class="wishlist-btn"
    >
      <mat-icon [class.spin]="loading">
        {{ loading ? 'hourglass_empty' : isInWishlist ? 'favorite' : 'favorite_border' }}
      </mat-icon>
    </button>
  `,
  styles: [
    `
      .wishlist-btn {
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          transform: scale(1.1);
        }

        &.active mat-icon {
          color: #e91e63;
          animation: pulse 0.3s ease;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .spin {
        animation: spin 1s linear infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.2);
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
class WishlistButtonComponent {
  @Input() isInWishlist = false;
  @Input() loading = false;
  @Input() productId?: number;
  @Output() onToggle = new EventEmitter<{ productId?: number; isInWishlist: boolean }>();

  handleToggle() {
    this.onToggle.emit({
      productId: this.productId,
      isInWishlist: !this.isInWishlist,
    });
  }
}

const meta: Meta<WishlistButtonComponent> = {
  component: WishlistButtonComponent,
  title: 'Shop/WishlistButton',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    isInWishlist: {
      control: 'boolean',
      description: 'Whether the product is currently in the wishlist',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state when toggling wishlist',
    },
    productId: {
      control: 'number',
      description: 'ID of the product',
    },
    onToggle: {
      action: 'toggled',
      description: 'Emitted when the wishlist button is clicked',
    },
  },
};

export default meta;

type Story = StoryObj<WishlistButtonComponent>;

export const NotInWishlist: Story = {
  args: {
    isInWishlist: false,
    loading: false,
    productId: 1,
    onToggle: fn(),
  },
};

export const InWishlist: Story = {
  args: {
    isInWishlist: true,
    loading: false,
    productId: 1,
    onToggle: fn(),
  },
};

export const Loading: Story = {
  args: {
    isInWishlist: false,
    loading: true,
    productId: 1,
    onToggle: fn(),
  },
};

export const Interactive: Story = {
  args: {
    isInWishlist: false,
    loading: false,
    productId: 42,
    onToggle: fn(),
  },
  play: async () => {
    // Users can interact with the button in the story
  },
};
