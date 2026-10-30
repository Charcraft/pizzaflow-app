'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { DEMO_PRODUCTS, formatMoney, type DemoProduct } from '@/lib/menu/products'

export function ProductCustomizer({ product }: { product: DemoProduct }) {
  const { addItem } = useCart()
  const [variantId, setVariantId] = useState(
    product.variants[1]?.id ?? product.variants[0]?.id ?? '',
  )
  const [extras, setExtras] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [halfFlavor, setHalfFlavor] = useState('')
  const [added, setAdded] = useState(false)

  const variant = product.variants.find((item) => item.id === variantId)
  const otherPizzas = useMemo(
    () => DEMO_PRODUCTS.filter((item) => item.category === 'pizza' && item.id !== product.id),
    [product.id],
  )

  const selectedExtras = product.ingredients.filter((item) => extras.includes(item.id))
  const extrasCents = selectedExtras.reduce((sum, item) => sum + item.priceCents, 0)
  const unitPriceCents = product.basePriceCents + (variant?.priceModifierCents ?? 0) + extrasCents
  const totalCents = unitPriceCents * quantity

  const toggleExtra = (id: string) => {
    setExtras((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const handleAdd = () => {
    const customizations = selectedExtras.map((item) => ({
      name: item.name,
      priceCents: item.priceCents,
    }))
    if (halfFlavor) {
      customizations.push({ name: `Mitad: ${halfFlavor}`, priceCents: 0 })
    }

    addItem({
      productId: product.id,
      name: product.name,
      variantId: variant?.id,
      variantName: variant?.name,
      unitPriceCents,
      quantity,
      customizations,
    })
    setAdded(true)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/menu" className="text-red-600 hover:underline mb-4 inline-block">
          ← Volver al menú
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Tamaño</h3>
              <div className="space-y-2">
                {product.variants.map((item) => {
                  const price = product.basePriceCents + item.priceModifierCents
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                        variantId === item.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="variant"
                          checked={variantId === item.id}
                          onChange={() => setVariantId(item.id)}
                        />
                        {item.name}
                      </span>
                      <span className="font-medium">{formatMoney(price)}</span>
                    </label>
                  )
                })}
                {product.variants.length === 0 && (
                  <p className="text-sm text-gray-500">Producto sin variantes.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Extras</h3>
              <div className="space-y-2">
                {product.ingredients.map((ingredient) => (
                  <label
                    key={ingredient.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      ingredient.available
                        ? 'cursor-pointer border-gray-200 hover:bg-gray-50'
                        : 'opacity-50 border-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        disabled={!ingredient.available}
                        checked={extras.includes(ingredient.id)}
                        onChange={() => toggleExtra(ingredient.id)}
                      />
                      {ingredient.name} {ingredient.available ? '' : '(Agotado)'}
                    </span>
                    <span>+{formatMoney(ingredient.priceCents)}</span>
                  </label>
                ))}
                {product.ingredients.length === 0 && (
                  <p className="text-sm text-gray-500">Sin extras configurables.</p>
                )}
              </div>

              {product.category === 'pizza' && otherPizzas.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="half-flavor">
                    Mitad y mitad (opcional)
                  </label>
                  <select
                    id="half-flavor"
                    value={halfFlavor}
                    onChange={(event) => setHalfFlavor(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Un solo sabor</option>
                    {otherPizzas.map((item) => (
                      <option key={item.id} value={item.name}>
                        Mitad {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Cantidad</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="w-9 h-9 rounded-full border border-gray-300 hover:bg-white"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="w-9 h-9 rounded-full border border-gray-300 hover:bg-white"
              >
                +
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-500">Total</div>
                <div className="text-2xl font-bold text-red-600">{formatMoney(totalCents)}</div>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className={`px-5 py-3 rounded-xl font-semibold ${
                  added ? 'bg-green-100 text-green-700' : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {added ? '✓ Agregado' : 'Agregar al carrito'}
              </button>
            </div>
          </div>

          {added && (
            <div className="mt-4 flex justify-end">
              <Link href="/cart" className="text-sm text-red-600 hover:underline">
                Ir al carrito →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
