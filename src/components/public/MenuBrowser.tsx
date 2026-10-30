'use client'

import { useMemo, useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Icon } from '@/components/ui/Icon'
import { DEMO_PRODUCTS } from '@/lib/menu/products'

const CATEGORIES = [
  { key: 'all', label: 'Todo' },
  { key: 'pizza', label: 'Pizzas' },
] as const

type Category = (typeof CATEGORIES)[number]['key']

export function MenuBrowser() {
  const [category, setCategory] = useState<Category>('all')
  const [query, setQuery] = useState('')

  const products = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return DEMO_PRODUCTS.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category
      const matchesQuery =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line bg-paper/70 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Categorías">
          {CATEGORIES.map((item) => {
            const active = category === item.key
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(item.key)}
                className={`shrink-0 rounded-[10px] px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-ink text-white'
                    : 'text-muted hover:bg-cream hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <label className="relative block sm:w-64">
          <span className="sr-only">Buscar en el menú</span>
          <Icon
            name="spark"
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar pizza, bebida..."
            className="h-11 w-full rounded-[10px] border border-line bg-paper pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-tomato focus:outline-none"
          />
        </label>
      </div>

      <p className="mt-5 text-xs text-muted">
        {products.length} {products.length === 1 ? 'producto' : 'productos'}
      </p>

      {products.length === 0 ? (
        <div className="mt-4 rounded-panel border border-dashed border-line bg-paper p-10 text-center">
          <p className="font-medium text-ink">No encontramos ese producto.</p>
          <p className="mt-1 text-sm text-muted">Prueba con otra palabra o cambia de categoría.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
