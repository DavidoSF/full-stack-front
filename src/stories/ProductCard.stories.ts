import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductItem } from '../app/components/shop-page/products-page/product-item/product-item';

const defaultProduct = {
  name: 'Stylo Bleu',
  price: 2.5,
  _avg: 4,
  ratings: [{ user_id: 2, value: 4 }],
  id: 1,
  description: 'Un stylo bleu de haute qualité pour une écriture fluide et confortable.',
};

const meta: Meta<ProductItem> = {
  component: ProductItem,
  title: 'Shop/Product Card',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, RouterTestingModule, MatCardModule, MatButtonModule],
    }),
  ],
  args: {
    product: defaultProduct,
  },
};

export default meta;

export const Default: StoryObj<ProductItem> = {
  render: (args) => ({
    component: ProductItem,
    props: args,
  }),
};
