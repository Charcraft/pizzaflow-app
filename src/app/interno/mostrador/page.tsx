'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { useCart } from '@/hooks/useCart'
import { DEMO_PRODUCTS, formatMoney } from '@/lib/menu/products'
import { createOrder } from '@/lib/orders/store'
import type { CreateOrderInput } from '@/lib/orders/types'
import { buildOrderWhatsAppUrl } from '@/lib/orders/whatsapp'

const CATEGORY_LABEL: Record<string, string> = {
  all: 'Todo',
  pizza: 'Pizzas',
  bebida: 'Bebidas',
  extra: 'Extras',
}

export default function MostradorPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [customerName, setCustomerName] = useState('Mostrador')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash')
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastOrderNumber, setLastOrderNumber] = useState<number | null>(null)
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('')

  const { items, addItem, updateQuantity, removeItem, totalCents, totalItems, clearCart } =
    useCart()

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(DEMO_PRODUCTS.map((product) => product.category)))],
    [],
  )

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return DEMO_PRODUCTS.filter((product) => {
      const matchesQuery = !normalized || product.name.toLowerCase().includes(normalized)
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory
      return matchesQuery && matchesCategory
    })
  }, [activeCategory, query])

  const handleCreateOrder = () => {
    if (items.length === 0) {
      alert('Agrega productos al carrito')
      return
    }
    if (!customerName.trim()) {
      alert('Ingresa nombre del cliente')
      return
    }

    const input: CreateOrderInput = {
      source: 'counter',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        variantId: item.variantId,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        customizations: item.customizations,
      })),
      paymentMethod,
      paymentStatus: 'pending',
    }

    const order = createOrder(input)
    const whatsappUrl = buildOrderWhatsAppUrl(order)
    setLastOrderNumber(order.orderNumber)
    setLastWhatsAppUrl(whatsappUrl)
    setShowSuccess(true)
    clearCart()
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setTimeout(() => setShowSuccess(false), 5000)
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Operación · POS
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Mostrador
            </h1>
            <p className="mt-1 text-sm text-muted">
              Toma el pedido, cobra y mándalo a cocina en un solo paso.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-card border border-line bg-paper px-3 py-2 text-xs text-muted shadow-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-basil" />
            Caja abierta · turno en vivo
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_380px]">
          <section>
            <div className="flex flex-col gap-3 rounded-panel border border-line bg-paper p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-1 overflow-x-auto">
                {categories.map((category) => {
                  const active = activeCategory === category
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`shrink-0 rounded-[9px] px-3 py-2 text-xs font-medium transition-colors ${
                        active
                          ? 'bg-night text-white'
                          : 'text-muted hover:bg-cream hover:text-ink'
                      }`}
                    >
                      {CATEGORY_LABEL[category] ?? category}
                    </button>
                  )
                })}
              </div>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar producto..."
                className="h-10 w-full rounded-[9px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none sm:w-56"
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col rounded-card border border-line bg-paper p-4 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-sm font-semibold">{product.name}</h2>
                    <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                      {CATEGORY_LABEL[product.category] ?? product.category}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 flex-1 text-xs leading-5 text-muted">
                    {product.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="tabular text-sm font-semibold">
                      {formatMoney(product.basePriceCents)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          productId: product.id,
                          name: product.name,
                          unitPriceCents: product.basePriceCents,
                          quantity: 1,
                        })
                      }
                      className="inline-flex h-8 items-center gap-1 rounded-[8px] bg-tomato px-2.5 text-xs font-medium text-white hover:bg-tomato-deep"
                    >
                      <Icon name="plus" size={13} />
                      Agregar
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <p className="mt-6 rounded-card border border-dashed border-line bg-paper p-8 text-center text-sm text-muted">
                No hay productos con ese filtro.
              </p>
            )}
          </section>

          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-panel border border-line bg-paper p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Ticket en curso</h2>
                <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] text-muted">
                  {totalItems} items
                </span>
              </div>

              {items.length === 0 ? (
                <p className="mt-5 rounded-card border border-dashed border-line bg-cream/60 p-5 text-center text-xs text-muted">
                  Agrega productos del catálogo para armar la comanda.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2 text-sm">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{item.name}</div>
                        <div className="text-[11px] text-muted">
                          {formatMoney(item.unitPriceCents)} c/u
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-line hover:bg-cream"
                          aria-label={`Quitar ${item.name}`}
                        >
                          <Icon name="minus" size={12} />
                        </button>
                        <span className="tabular w-6 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-line hover:bg-cream"
                          aria-label={`Agregar ${item.name}`}
                        >
                          <Icon name="plus" size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="ml-1 flex h-7 w-7 items-center justify-center rounded-[7px] text-muted hover:bg-tomato/5 hover:text-tomato"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <Icon name="trash" size={13} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 space-y-3 border-t border-line pt-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted" htmlFor="pos-name">
                    Cliente
                  </label>
                  <input
                    id="pos-name"
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    className="h-10 w-full rounded-[9px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted" htmlFor="pos-phone">
                    Teléfono (opcional)
                  </label>
                  <input
                    id="pos-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    className="h-10 w-full rounded-[9px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted" htmlFor="pos-payment">
                    Pago
                  </label>
                  <select
                    id="pos-payment"
                    value={paymentMethod}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value as 'cash' | 'card' | 'transfer')
                    }
                    className="h-10 w-full rounded-[9px] border border-line bg-cream px-3 text-sm focus:border-tomato focus:outline-none"
                  >
                    <option value="cash">Efectivo</option>
                    <option value="card">Tarjeta</option>
                    <option value="transfer">Transferencia</option>
                  </select>
                </div>

                <div className="flex items-end justify-between border-t border-line pt-3">
                  <span className="text-sm text-muted">Total</span>
                  <span className="tabular text-2xl font-semibold text-ink">
                    {formatMoney(totalCents)}
                  </span>
                </div>

                <Button type="button" onClick={handleCreateOrder} size="lg" className="w-full">
                  <Icon name="receipt" size={18} />
                  Cobrar y enviar a cocina
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-success-title"
        >
          <div className="w-full max-w-sm rounded-panel border border-line bg-paper p-6 text-center shadow-soft">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-basil/10 text-basil">
              <Icon name="check" size={28} />
            </span>
            <h3 id="order-success-title" className="mt-4 text-xl font-semibold">
              Pedido enviado a cocina
            </h3>
            <p className="tabular mt-1 text-3xl font-semibold text-tomato">
              #{lastOrderNumber}
            </p>
            <p className="mt-2 text-sm text-muted">
              La comanda ya está en el KDS. Abrimos WhatsApp con el resumen para Leito;
              si no se abrió, usa el botón.
            </p>
            {lastWhatsAppUrl && (
              <a
                href={lastWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-basil text-sm font-medium text-white hover:opacity-90"
              >
                Abrir WhatsApp
              </a>
            )}
            <Button
              type="button"
              onClick={() => setShowSuccess(false)}
              variant="secondary"
              className="mt-2 w-full"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
