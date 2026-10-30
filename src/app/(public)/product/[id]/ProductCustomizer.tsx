'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { DEMO_PRODUCTS, formatMoney, type DemoProduct } from '@/lib/menu/products'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PizzaArt } from '@/components/public/PizzaArt'

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
  const unitPriceCents =
    product.basePriceCents + (variant?.priceModifierCents ?? 0) + extrasCents
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
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <nav className="flex items-center gap-1.5 text-xs text-muted" aria-label="Ruta">
        <Link href="/menu" className="hover:text-ink">
          Menú
        </Link>
        <Icon name="chevron-right" size={12} />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-panel border border-line bg-[#F6E3C5]">
            <PizzaArt className="h-[86%]" rotation={5} variant={product.artVariant ?? 0} />
            <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium text-muted">
              Hecha al momento
            </span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
              Personaliza
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-tight text-ink sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{product.description}</p>
          </div>

          <section className="mt-8">
            <h2 className="text-sm font-semibold">Tamaño</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {product.variants.map((item) => {
                const price = product.basePriceCents + item.priceModifierCents
                const active = variantId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setVariantId(item.id)}
                    aria-pressed={active}
                    className={`rounded-card border p-3 text-left transition-colors ${
                      active
                        ? 'border-tomato bg-tomato/5 ring-1 ring-tomato'
                        : 'border-line bg-paper hover:bg-cream'
                    }`}
                  >
                    <span className="block text-sm font-medium">{item.name}</span>
                    <span className="tabular mt-0.5 block text-xs text-muted">
                      {formatMoney(price)}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-sm font-semibold">Extras</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {product.ingredients.map((ingredient) => {
                const active = extras.includes(ingredient.id)
                return (
                  <label
                    key={ingredient.id}
                    className={`flex items-center justify-between gap-3 rounded-card border p-3 text-sm ${
                      ingredient.available
                        ? active
                          ? 'border-tomato bg-tomato/5'
                          : 'border-line bg-paper hover:bg-cream'
                        : 'cursor-not-allowed border-line bg-cream opacity-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        disabled={!ingredient.available}
                        checked={active}
                        onChange={() => toggleExtra(ingredient.id)}
                        className="h-4 w-4 accent-tomato"
                      />
                      <span>
                        {ingredient.name}
                        {!ingredient.available && (
                          <span className="ml-1 text-xs text-muted">(agotado)</span>
                        )}
                      </span>
                    </span>
                    <span className="tabular text-xs text-muted">
                      +{formatMoney(ingredient.priceCents)}
                    </span>
                  </label>
                )
              })}
              {product.ingredients.length === 0 && (
                <p className="text-sm text-muted">Este producto no tiene extras.</p>
              )}
            </div>

            {product.category === 'pizza' && otherPizzas.length > 0 && (
              <div className="mt-5">
                <label className="block text-sm font-semibold" htmlFor="half-flavor">
                  Mitad y mitad <span className="font-normal text-muted">(opcional)</span>
                </label>
                <select
                  id="half-flavor"
                  value={halfFlavor}
                  onChange={(event) => setHalfFlavor(event.target.value)}
                  className="mt-2 h-11 w-full rounded-[10px] border border-line bg-paper px-3 text-sm focus:border-tomato focus:outline-none"
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
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-panel border border-line bg-paper p-5 shadow-soft">
            <h2 className="text-sm font-semibold">Tu selección</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Producto</dt>
                <dd className="text-right font-medium">{product.name}</dd>
              </div>
              {variant && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Tamaño</dt>
                  <dd className="font-medium">{variant.name}</dd>
                </div>
              )}
              {halfFlavor && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Mitad</dt>
                  <dd className="font-medium">{halfFlavor}</dd>
                </div>
              )}
              {selectedExtras.length > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Extras</dt>
                  <dd className="text-right font-medium">
                    {selectedExtras.map((item) => item.name).join(', ')}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm text-muted">Cantidad</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-line hover:bg-cream"
                  aria-label="Quitar una unidad"
                >
                  <Icon name="minus" size={15} />
                </button>
                <span className="tabular w-8 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-line hover:bg-cream"
                  aria-label="Agregar una unidad"
                >
                  <Icon name="plus" size={15} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
              <span className="text-sm text-muted">Total</span>
              <span className="tabular text-2xl font-semibold text-ink">
                {formatMoney(totalCents)}
              </span>
            </div>

            <Button type="button" onClick={handleAdd} size="lg" className="mt-4 w-full">
              {added ? (
                <>
                  <Icon name="check" size={18} />
                  Agregado al carrito
                </>
              ) : (
                <>
                  <Icon name="bag" size={18} />
                  Agregar al carrito
                </>
              )}
            </Button>
            {added && (
              <ButtonLink href="/cart" variant="secondary" size="md" className="mt-2 w-full">
                Ir al carrito
                <Icon name="arrow-right" size={16} />
              </ButtonLink>
            )}
            <p className="mt-3 text-center text-xs text-muted">
              Recoge en mostrador · 15-25 min
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
