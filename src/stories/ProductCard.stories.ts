import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductItem } from '../app/components/shop-page/products-page/product-item/product-item';
import { ProductModel } from '../app/components/shop-page/models/product.model';

const meta: Meta<ProductItem> = {
  component: ProductItem,
  title: 'Shop/ProductCard',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, RouterTestingModule, MatCardModule, MatButtonModule],
    }),
  ],
};

export default meta;

type Story = StoryObj<ProductItem>;

export const Default: Story = {
  args: {
    product: {
      id: 1,
      name: 'Stylo Bleu',
      description: 'Un stylo bleu de haute qualité pour une écriture fluide et confortable.',
      price: 2.5,
      _avg: 4.0,
      ratings: [],
    } as ProductModel,
  },
};

export const HighRated: Story = {
  args: {
    product: {
      id: 2,
      name: 'Premium Notebook',
      description: 'A luxurious notebook with premium paper quality.',
      price: 15.99,
      _avg: 4.8,
      ratings: [],
    } as ProductModel,
  },
};

export const LowRated: Story = {
  args: {
    product: {
      id: 3,
      name: 'Basic Eraser',
      description: 'Standard eraser for everyday use.',
      price: 0.99,
      _avg: 2.3,
      ratings: [],
    } as ProductModel,
  },
};

export const NoRating: Story = {
  args: {
    product: {
      id: 4,
      name: 'New Pencil Set',
      description: 'Brand new pencil set, not yet rated by customers.',
      price: 5.49,
      _avg: 0,
      ratings: [],
    } as ProductModel,
  },
};

export const Expensive: Story = {
  args: {
    product: {
      id: 5,
      name: 'Designer Fountain Pen',
      description: 'Luxury fountain pen with gold-plated nib and elegant design.',
      price: 249.99,
      _avg: 4.5,
      ratings: [],
    } as ProductModel,
  },
};
