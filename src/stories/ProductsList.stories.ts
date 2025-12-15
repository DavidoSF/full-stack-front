import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata, applicationConfig } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ProductsPage } from '../app/components/shop-page/products-page/products-page';
import { ProductModel } from '../app/components/shop-page/models/product.model';
import { productReducer } from '../app/components/shop-page/state/product.reducer';
import { ProductEffects } from '../app/components/shop-page/state/product.effects';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

const mockProducts: ProductModel[] = [
  {
    id: 1,
    name: 'Stylo Bleu',
    description: 'Un stylo bleu de haute qualité pour une écriture fluide et confortable.',
    price: 2.5,
    _avg: 4.0,
    ratings: [],
    lowStockThreshold: 10,
    stock: 50,
  },
  {
    id: 2,
    name: 'Cahier A4',
    description: 'Cahier format A4 avec 200 pages lignées.',
    price: 3.99,
    _avg: 4.5,
    ratings: [],
    lowStockThreshold: 10,
    stock: 8,
  },
  {
    id: 3,
    name: 'Gomme Blanche',
    description: 'Gomme de qualité sans résidu.',
    price: 0.99,
    _avg: 3.8,
    ratings: [],
    lowStockThreshold: 5,
    stock: 0,
  },
  {
    id: 4,
    name: 'Règle 30cm',
    description: 'Règle transparente graduée en centimètres.',
    price: 1.49,
    _avg: 4.2,
    ratings: [],
    lowStockThreshold: 15,
    stock: 12,
  },
  {
    id: 5,
    name: 'Surligneur Jaune',
    description: 'Surligneur fluorescent pour vos notes importantes.',
    price: 1.99,
    _avg: 4.1,
    ratings: [],
    lowStockThreshold: 10,
    stock: 25,
  },
  {
    id: 6,
    name: 'Crayon à papier',
    description: 'Crayon à papier HB de qualité supérieure.',
    price: 0.5,
    _avg: 4.3,
    ratings: [],
    lowStockThreshold: 20,
    stock: 60,
  },
  {
    id: 7,
    name: 'Feutres Couleurs',
    description: 'Set de 12 feutres de différentes couleurs.',
    price: 5.99,
    _avg: 4.6,
    ratings: [],
    lowStockThreshold: 15,
    stock: 18,
  },
  {
    id: 8,
    name: 'Agrafeuse',
    description: 'Agrafeuse métallique avec capacité de 20 feuilles.',
    price: 7.49,
    _avg: 4.0,
    ratings: [],
    lowStockThreshold: 5,
    stock: 4,
  },
  {
    id: 9,
    name: 'Trousse de Rangement',
    description: 'Trousse spacieuse pour ranger vos fournitures scolaires.',
    price: 4.99,
    _avg: 4.4,
    ratings: [],
    lowStockThreshold: 10,
    stock: 30,
  },
  {
    id: 10,
    name: 'Calculatrice Scientifique',
    description: 'Calculatrice scientifique avec fonctions avancées.',
    price: 15.99,
    _avg: 4.7,
    ratings: [],
    lowStockThreshold: 3,
    stock: 2,
  },
];

const meta: Meta<ProductsPage> = {
  component: ProductsPage,
  title: 'Shop/ProductsList',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatCardModule, MatButtonModule],
    }),
    applicationConfig({
      providers: [
        provideStore({ products: productReducer }),
        provideEffects([ProductEffects]),
        provideHttpClient(),
        provideRouter([]),
      ],
    }),
  ],
  argTypes: {
    page: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Current page number',
    },
    page_size: {
      control: { type: 'select' },
      options: [5, 10, 20],
      description: 'Number of items per page',
    },
  },
  render: (args) => ({
    props: {
      ...args,
      page: Number(args.page),
      page_size: Number(args.page_size),
      listProducts: mockProducts,
    },
  }),
};

export default meta;

type Story = StoryObj<ProductsPage>;

export const Default: Story = {
  args: {
    page: 1,
    page_size: 10,
  },
};

export const SmallPageSize: Story = {
  args: {
    page: 1,
    page_size: 5,
  },
};

export const LargePageSize: Story = {
  args: {
    page: 1,
    page_size: 10,
  },
};

export const SecondPage: Story = {
  args: {
    page: 2,
    page_size: 5,
  },
};
