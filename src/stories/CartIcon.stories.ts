import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata, applicationConfig } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartIconComponent } from '../app/components/shop-page/cart/cart-icon.component';

const meta: Meta<CartIconComponent> = {
  component: CartIconComponent,
  title: 'Shop/CartIcon',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, RouterTestingModule, MatTooltipModule],
    }),
    applicationConfig({
      providers: [
        provideMockStore({
          initialState: {
            cart: {
              items: [],
              totalPrice: 0,
              count: 0,
              loading: false,
              error: null,
            },
          },
        }),
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<CartIconComponent>;

export const Empty: Story = {
  args: {
    showTooltip: true,
  },
  decorators: [
    applicationConfig({
      providers: [
        provideMockStore({
          initialState: {
            cart: {
              items: [],
              totalPrice: 0,
              count: 0,
              loading: false,
              error: null,
            },
          },
        }),
      ],
    }),
  ],
};

export const WithItems: Story = {
  args: {
    showTooltip: true,
  },
  decorators: [
    applicationConfig({
      providers: [
        provideMockStore({
          initialState: {
            cart: {
              items: [
                { productId: 1, name: 'Product 1', price: 10, quantity: 2 },
                { productId: 2, name: 'Product 2', price: 15, quantity: 1 },
              ],
              totalPrice: 35,
              count: 3,
              loading: false,
              error: null,
            },
          },
        }),
      ],
    }),
  ],
};

export const WithManyItems: Story = {
  args: {
    showTooltip: true,
  },
  decorators: [
    applicationConfig({
      providers: [
        provideMockStore({
          initialState: {
            cart: {
              items: Array.from({ length: 15 }, (_, i) => ({
                productId: i + 1,
                name: `Product ${i + 1}`,
                price: 10 + i,
                quantity: 1,
              })),
              totalPrice: 525,
              count: 15,
              loading: false,
              error: null,
            },
          },
        }),
      ],
    }),
  ],
};

export const WithoutTooltip: Story = {
  args: {
    showTooltip: false,
  },
  decorators: [
    applicationConfig({
      providers: [
        provideMockStore({
          initialState: {
            cart: {
              items: [{ productId: 1, name: 'Product 1', price: 10, quantity: 2 }],
              totalPrice: 20,
              count: 2,
              loading: false,
              error: null,
            },
          },
        }),
      ],
    }),
  ],
};
