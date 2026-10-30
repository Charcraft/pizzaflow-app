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
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-paper shadow-soft transition-transform duration-200 hover:-translate-y-0.5">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-[#F6E3C5]">
        {product.category === 'pizza' ? (
          <PizzaArt
            className="h-[84%] transition-transform duration-500 group-hover:scale-[1.03]"
            rotation={(Number(product.id) * 11) % 18 - 9}
            variant={product.artVariant ?? 0}
          />
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
        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-night">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-ink">{product.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm leading-6 text-muted">
          {product.description}
        </p>

        {product.variants.length > 0 && (
          <div className="mt-4">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Elige tamaño
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {product.variants.map((item) => {
                const active = selectedVariantId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedVariantId(item.id)}
                    aria-pressed={active}
                    className={`rounded-[8px] border px-2 py-1.5 text-left transition-colors ${
                      active
                        ? 'border-tomato bg-tomato/5 text-ink'
                        : 'border-line text-muted hover:bg-cream'
                    }`}
                  >
                    <span className="block text-[11px] font-medium">{item.name}</span>
                    <span className="tabular block text-[10px]">
                      {formatMoney(product.basePriceCents + item.priceModifierCents)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
          <div>
            <span className="block text-[10px] text-muted">Precio</span>
            <span className="tabular text-xl font-semibold text-ink">
              {formatMoney(unitPriceCents)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              href={`/product/${product.id}`}
              className="inline-flex h-9 items-center rounded-[8px] border border-line px-2.5 text-xs font-medium text-ink hover:bg-cream"
            >
              Personalizar
            </Link>
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Agregar ${product.name} al carrito`}
              className={`inline-flex h-9 items-center gap-1 rounded-[8px] px-2.5 text-xs font-medium transition-colors ${
                added
                  ? 'bg-basil/10 text-basil'
                  : 'bg-tomato text-white hover:bg-tomato-deep'
              }`}
            >
              {added ? (
                <>
                  <Icon name="check" size={13} />
                  Agregado
                </>
              ) : (
                <>
                  <Icon name="plus" size={13} />
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
