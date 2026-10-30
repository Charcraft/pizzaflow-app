import { formatMoney } from '@/lib/menu/products'

export type PromoType = 'percent' | 'fixed'

export interface Promotion {
  code: string
  title: string
  description: string
  type: PromoType
  value: number
  minOrderCents: number
  badge: string
}

export const PROMOTIONS: Promotion[] = [
  {
    code: 'BIENVENIDO10',
    title: '10% en tu primer pedido',
    description: 'Válido en pedidos desde $100. Se aplica en el carrito.',
    type: 'percent',
    value: 10,
    minOrderCents: 10000,
    badge: 'Primera compra',
  },
  {
    code: 'COMBOFLOW',
    title: '$30 de descuento en tu combo',
    description: 'Pizza + bebida o alitas. Pedido mínimo $200.',
    type: 'fixed',
    value: 3000,
    minOrderCents: 20000,
    badge: 'Combo',
  },
  {
    code: 'FAMILIA15',
    title: '15% para la mesa familiar',
    description: 'Pedidos desde $300. Ideal para compartir.',
    type: 'percent',
    value: 15,
    minOrderCents: 30000,
    badge: 'Familia',
  },
]

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase()
}

export function getPromotion(code: string | null | undefined): Promotion | null {
  if (!code) return null
  const normalized = normalizePromoCode(code)
  return PROMOTIONS.find((promo) => promo.code === normalized) ?? null
}

export interface PromoResult {
  promo: Promotion | null
  discountCents: number
  error: string | null
}

export function getPromoDiscount(
  code: string | null | undefined,
  subtotalCents: number,
): PromoResult {
  const promo = getPromotion(code)
  if (!promo) {
    return { promo: null, discountCents: 0, error: code ? 'Código no válido.' : null }
  }

  if (subtotalCents < promo.minOrderCents) {
    const missing = promo.minOrderCents - subtotalCents
    return {
      promo,
      discountCents: 0,
      error: `Te faltan ${formatMoney(missing)} para usar ${promo.code}.`,
    }
  }

  const discountCents =
    promo.type === 'percent'
      ? Math.round((subtotalCents * promo.value) / 100)
      : Math.min(promo.value, subtotalCents)

  return { promo, discountCents, error: null }
}
