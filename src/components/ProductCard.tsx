'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { formatMoney, type DemoProduct } from '@/lib/menu/products'
import { Icon, type IconName } from '@/components/ui/Icon'
import { PizzaArt } from '@/components/public/PizzaArt'

const CATEGORY_ICON: Record<DemoProduct['category'], IconName> = {
  pizza: 'pizza',
  bebida: 'bag',
  extra: 'flame',
}

const CATEGORY_LABEL: Record<DemoProduct['category'], string> = {
  pizza: 'Pizza',
  bebida: 'Bebida',
  extra: 'Extra',
}

export function ProductCard({ product }: { product: DemoProduct }) {
  const { addItem } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[1]?.id ?? product.variants[0]?.id ?? '',
  )
  const [added, setAdded] = useState(false)

  const variant = product.variants.find((item) => item.id === selectedVariantId)
  const unitPriceCents = product.basePriceCents + (variant?.priceModifierCents ?? 0)

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      variantId: variant?.id,
      variantName: variant?.name,
      unitPriceCents,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line bg-paper shadow-soft transition-transform duration-200 hover:-translate-y-0.5">
      <div className="relative flex aspect-[5/4] items-center justify-center bg-[#F6E3C5]">
        {product.category === 'pizza' ? (
          <PizzaArt className="h-[82%]" rotation={(Number(product.id) * 11) % 18 - 9} />
        ) : (
          <Icon
            name={CATEGORY_ICON[product.category]}
            size={64}
            className="text-tomato/80"
            strokeWidth={1.2}
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-medium text-muted">
          {CATEGORY_LABEL[product.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-ink">{product.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm leading-6 text-muted">
          {product.description}
        </p>

        {product.variants.length > 0 && (
          <div className="mt-4">
            <label
              className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
              htmlFor={`variant-${product.id}`}
            >
              Tamaño
            </label>
            <select
              id={`variant-${product.id}`}
              value={selectedVariantId}
              onChange={(event) => setSelectedVariantId(event.target.value)}
              className="h-10 w-full rounded-[10px] border border-line bg-cream px-3 text-sm text-ink focus:border-tomato focus:outline-none"
            >
              {product.variants.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {formatMoney(product.basePriceCents + item.priceModifierCents)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span className="tabular text-lg font-semibold text-ink">
            {formatMoney(unitPriceCents)}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/product/${product.id}`}
              className="inline-flex h-10 items-center rounded-[10px] border border-line px-3 text-sm font-medium text-ink hover:bg-cream"
            >
              Personalizar
            </Link>
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Agregar ${product.name} al carrito`}
              className={`inline-flex h-10 items-center gap-1.5 rounded-[10px] px-3 text-sm font-medium transition-colors ${
                added
                  ? 'bg-basil/10 text-basil'
                  : 'bg-tomato text-white hover:bg-tomato-deep'
              }`}
            >
              {added ? (
                <>
                  <Icon name="check" size={15} />
                  Agregado
                </>
              ) : (
                <>
                  <Icon name="plus" size={15} />
                  Agregar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
