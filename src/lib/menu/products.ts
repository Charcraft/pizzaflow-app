export interface DemoVariant {
  id: string
  name: string
  priceModifierCents: number
}

export interface DemoIngredient {
  id: string
  name: string
  priceCents: number
  available: boolean
}

export interface DemoProduct {
  id: string
  name: string
  description: string
  basePriceCents: number
  category: 'pizza' | 'bebida' | 'extra'
  imageUrl: string | null
  variants: DemoVariant[]
  ingredients: DemoIngredient[]
}

const PIZZA_VARIANTS: DemoVariant[] = [
  { id: 'v-pq', name: 'Pequeña', priceModifierCents: -2000 },
  { id: 'v-md', name: 'Mediana', priceModifierCents: 0 },
  { id: 'v-gd', name: 'Grande', priceModifierCents: 3000 },
  { id: 'v-fm', name: 'Familiar', priceModifierCents: 6000 },
]

const EXTRA_INGREDIENTS: DemoIngredient[] = [
  { id: 'ing-champ', name: 'Champiñones', priceCents: 500, available: true },
  { id: 'ing-aceit', name: 'Aceitunas', priceCents: 400, available: true },
  { id: 'ing-pim', name: 'Pimiento', priceCents: 300, available: true },
  { id: 'ing-ceb', name: 'Cebolla caramelizada', priceCents: 400, available: false },
]

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: '1',
    name: 'Pizza Margarita',
    description: 'Salsa de tomate, mozzarella fresca y albahaca',
    basePriceCents: 8500,
    category: 'pizza',
    imageUrl: null,
    variants: PIZZA_VARIANTS,
    ingredients: EXTRA_INGREDIENTS,
  },
  {
    id: '2',
    name: 'Pizza Pepperoni',
    description: 'Salsa de tomate, mozzarella y pepperoni',
    basePriceCents: 9500,
    category: 'pizza',
    imageUrl: null,
    variants: PIZZA_VARIANTS,
    ingredients: EXTRA_INGREDIENTS,
  },
  {
    id: '3',
    name: 'Pizza Hawaiana',
    description: 'Salsa de tomate, mozzarella, jamón y piña',
    basePriceCents: 9500,
    category: 'pizza',
    imageUrl: null,
    variants: PIZZA_VARIANTS,
    ingredients: EXTRA_INGREDIENTS,
  },
  {
    id: '4',
    name: 'Pizza Cuatro Quesos',
    description: 'Mozzarella, parmesano, gorgonzola y provolone',
    basePriceCents: 10500,
    category: 'pizza',
    imageUrl: null,
    variants: PIZZA_VARIANTS,
    ingredients: EXTRA_INGREDIENTS,
  },
  {
    id: '5',
    name: 'Refresco 600ml',
    description: 'Coca Cola, Sprite o Fanta',
    basePriceCents: 2500,
    category: 'bebida',
    imageUrl: null,
    variants: [],
    ingredients: [],
  },
  {
    id: '6',
    name: 'Agua 500ml',
    description: 'Agua mineral',
    basePriceCents: 1500,
    category: 'bebida',
    imageUrl: null,
    variants: [],
    ingredients: [],
  },
  {
    id: '7',
    name: 'Alitas 6 piezas',
    description: 'Alitas BBQ con aderezo',
    basePriceCents: 7500,
    category: 'extra',
    imageUrl: null,
    variants: [],
    ingredients: [],
  },
  {
    id: '8',
    name: 'Borde de Queso',
    description: 'Borde rebozado con queso',
    basePriceCents: 2000,
    category: 'extra',
    imageUrl: null,
    variants: [],
    ingredients: [],
  },
]

export function getDemoProduct(id: string): DemoProduct | undefined {
  return DEMO_PRODUCTS.find((product) => product.id === id)
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(cents / 100)
}
