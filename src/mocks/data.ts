export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  owner_id: number;
  ratings: { user_id: number; value: number }[];
  promo?: {
    type: 'percentage' | 'free_shipping';
    value?: number;
    label: string;
  };
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Stylo Bleu',
    price: 2.5,
    created_at: '2025-01-10T10:00:00Z',
    owner_id: 10,
    ratings: [],
    promo: {
      type: 'percentage',
      value: 10,
      label: '10% OFF',
    },
  },
  {
    id: 2,
    name: 'Cahier A5',
    price: 3.9,
    created_at: '2025-02-01T09:30:00Z',
    owner_id: 11,
    ratings: [],
  },

  {
    id: 3,
    name: 'Classeur Rouge',
    price: 4.5,
    created_at: '2025-02-12T12:00:00Z',
    owner_id: 12,
    ratings: [],
    promo: {
      type: 'free_shipping',
      label: 'FREE SHIPPING',
    },
  },
  {
    id: 4,
    name: 'Crayon HB',
    price: 1.2,
    created_at: '2025-03-01T08:45:00Z',
    owner_id: 13,
    ratings: [],
  },
  {
    id: 5,
    name: 'Règle 30cm',
    price: 1.5,
    created_at: '2025-03-05T07:20:00Z',
    owner_id: 14,
    ratings: [],
  },
  {
    id: 6,
    name: 'Gomme Blanche',
    price: 0.9,
    created_at: '2025-03-10T14:10:00Z',
    owner_id: 15,
    ratings: [],
  },
  {
    id: 7,
    name: 'Surligneur Jaune',
    price: 1.7,
    created_at: '2025-03-11T11:00:00Z',
    owner_id: 16,
    ratings: [],
  },
  {
    id: 8,
    name: 'Pochette Plastique',
    price: 0.3,
    created_at: '2025-03-12T09:00:00Z',
    owner_id: 17,
    ratings: [],
  },
  {
    id: 9,
    name: 'Feutre Noir',
    price: 2.0,
    created_at: '2025-03-15T10:30:00Z',
    owner_id: 18,
    ratings: [],
  },
  {
    id: 10,
    name: 'Bloc Notes',
    price: 3.0,
    created_at: '2025-03-20T16:00:00Z',
    owner_id: 19,
    ratings: [],
  },
  {
    id: 11,
    name: 'Feuilles A4',
    price: 4.0,
    created_at: '2025-03-22T12:40:00Z',
    owner_id: 20,
    ratings: [],
  },
  {
    id: 12,
    name: 'Trousse Bleue',
    price: 6.5,
    created_at: '2025-03-25T13:00:00Z',
    owner_id: 21,
    ratings: [],
  },
  {
    id: 13,
    name: 'Colle Bâton',
    price: 1.3,
    created_at: '2025-04-01T07:00:00Z',
    owner_id: 10,
    ratings: [],
  },
  {
    id: 14,
    name: 'Ruban Adhésif',
    price: 2.8,
    created_at: '2025-04-03T08:00:00Z',
    owner_id: 11,
    ratings: [],
    promo: {
      type: 'free_shipping',
      label: 'FREE SHIPPING',
    },
  },
  {
    id: 15,
    name: 'Stylo Rouge',
    price: 2.5,
    created_at: '2025-04-05T10:20:00Z',
    owner_id: 12,
    ratings: [],
  },
  {
    id: 16,
    name: 'Feutres Couleur (Pack x10)',
    price: 7.9,
    created_at: '2025-04-10T14:00:00Z',
    owner_id: 13,
    ratings: [],
  },
  {
    id: 17,
    name: 'Pinceau Fin',
    price: 2.2,
    created_at: '2025-04-12T12:30:00Z',
    owner_id: 14,
    ratings: [],
  },
  {
    id: 18,
    name: 'Palette Aquarelle',
    price: 9.5,
    created_at: '2025-04-15T11:10:00Z',
    owner_id: 15,
    ratings: [],
  },
  {
    id: 19,
    name: 'Marqueur Effaçable',
    price: 3.4,
    created_at: '2025-04-18T09:40:00Z',
    owner_id: 16,
    ratings: [],
    promo: {
      type: 'percentage',
      value: 10,
      label: '10% OFF',
    },
  },
  {
    id: 20,
    name: 'Tampon Encreur',
    price: 5.0,
    created_at: '2025-04-20T15:00:00Z',
    owner_id: 17,
    ratings: [],
  },
];
