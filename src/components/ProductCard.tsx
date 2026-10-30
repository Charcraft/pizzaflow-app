'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { formatMoney, type DemoProduct } from '@/lib/menu/products'

const CATEGORY_ICON: Record<DemoProduct['category'], string> = {
  pizza: '🍕',
  bebida: '🥤',
  extra: '🍗',
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
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-red-50 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">{CATEGORY_ICON[product.category]}</span>
        </div>
        <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur rounded-full capitalize">
          {product.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-1">{product.description}</p>

        {product.variants.length > 0 && (
          <div className="mt-3">
            <label className="block text-xs text-gray-600 mb-1" htmlFor={`variant-${product.id}`}>
              Tamaño
            </label>
            <select
              id={`variant-${product.id}`}
              value={selectedVariantId}
              onChange={(event) => setSelectedVariantId(event.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {product.variants.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {formatMoney(product.basePriceCents + item.priceModifierCents)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
          <span className="text-lg font-bold text-red-600">{formatMoney(unitPriceCents)}</span>
          <div className="flex items-center gap-2">
            <Link
              href={`/product/${product.id}`}
              className="px-3 py-2 text-sm border border-red-200 text-red-700 rounded-lg hover:bg-red-50"
            >
              Personalizar
            </Link>
            <button
              type="button"
              onClick={handleAdd}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition ${
                added
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {added ? '✓ Agregado' : '+ Agregar'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
