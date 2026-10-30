'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { usePromo } from '@/hooks/usePromo'
import { createOrder } from '@/lib/orders/store'
import type { PaymentMethod } from '@/lib/orders/types'
import { buildOrderWhatsAppUrl } from '@/lib/orders/whatsapp'
import { formatMoney } from '@/lib/menu/products'
import { getPromoDiscount } from '@/lib/promotions'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

const PAYMENT_LABELS: Record<Exclude<PaymentMethod, 'pending'>, string> = {
  cash: 'Efectivo al recoger',
  card: 'Tarjeta al recoger',
  transfer: 'Transferencia',
}

const PAYMENT_HINTS: Record<Exclude<PaymentMethod, 'pending'>, string> = {
  cash: 'Pagas cuando recoges tu pedido.',
  card: 'Terminal en mostrador. No guardamos datos.',
  transfer: 'Te compartimos los datos al confirmar.',
}

export default function CheckoutPage() {
  const { items, totalCents, clearCart } = useCart()
  const { code, clearPromo } = usePromo()
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<Exclude<PaymentMethod, 'pending'>>('cash')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const promo = getPromoDiscount(code, totalCents)
  const discountCents = promo.discountCents
  const finalCents = totalCents - discountCents

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!customerName.trim()) {
      setError('Escribe el nombre de quien recoge el pedido.')
      return
    }

    const order = createOrder({
      source: 'web',
      customerName,
      customerPhone,
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
      discountCents,
      promoCode: code,
      notes,
    })

    clearCart()
    clearPromo()
    window.open(buildOrderWhatsAppUrl(order), '_blank', 'noopener,noreferrer')
    router.push(`/order/${order.id}`)
  }

  if (!items.length) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center sm:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-panel bg-paper text-tomato shadow-soft">
          <Icon name="bag" size={30} />
        </span>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-ink">
          No hay nada que cobrar
        </h1>
        <p className="mt-2 text-sm text-muted">Agrega una pizza antes de continuar.</p>
        <ButtonLink href="/menu" size="lg" className="mt-6">
          Ver el menú
        </ButtonLink>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <Icon name="arrow-left" size={15} />
        Volver al carrito
      </Link>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
            Checkout
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink sm:text-5xl">
            Recoger en mostrador.
          </h1>
          <p className="mt-2 text-sm text-muted">15-25 minutos · Pagas al recoger.</p>
        </div>
        <ol className="flex items-center gap-2 text-xs text-muted" aria-label="Pasos del pedido">
          <li className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-basil text-white">
              <Icon name="check" size={11} />
            </span>
            Carrito
          </li>
          <span className="h-px w-6 bg-line" />
          <li className="flex items-center gap-1.5 font-medium text-ink">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white">
              2
            </span>
            Datos
          </li>
          <span className="h-px w-6 bg-line" />
          <li className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line">
              3
            </span>
            Listo
          </li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <section className="rounded-panel border border-line bg-paper p-5 shadow-soft">
            <h2 className="text-sm font-semibold">¿Quién recoge?</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="customer-name">
                  Nombre *
                </label>
                <input
                  id="customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="h-11 w-full rounded-[10px] border border-line bg-paper px-3 text-sm focus:border-tomato focus:outline-none"
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted" htmlFor="customer-phone">
                  Teléfono <span className="font-normal">(opcional)</span>
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  className="h-11 w-full rounded-[10px] border border-line bg-paper px-3 text-sm focus:border-tomato focus:outline-none"
                  placeholder="55 1234 5678"
                />
              </div>
            </div>
          </section>

          <section className="rounded-panel border border-line bg-paper p-5 shadow-soft">
            <h2 className="text-sm font-semibold">Método de pago</h2>
            <div className="mt-4 space-y-2">
              {(Object.keys(PAYMENT_LABELS) as Array<keyof typeof PAYMENT_LABELS>).map(
                (method) => {
                  const active = paymentMethod === method
                  return (
                    <label
                      key={method}
                      className={`flex cursor-pointer items-start gap-3 rounded-card border p-3.5 transition-colors ${
                        active ? 'border-tomato bg-tomato/5' : 'border-line hover:bg-cream'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={active}
                        onChange={() => setPaymentMethod(method)}
                        className="mt-0.5 h-4 w-4 accent-tomato"
                      />
                      <span>
                        <span className="block text-sm font-medium">{PAYMENT_LABELS[method]}</span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {PAYMENT_HINTS[method]}
                        </span>
                      </span>
                    </label>
                  )
                },
              )}
            </div>
          </section>

          <section className="rounded-panel border border-line bg-paper p-5 shadow-soft">
            <label className="block text-sm font-semibold" htmlFor="notes">
              Notas para cocina <span className="font-normal text-muted">(opcional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="mt-3 w-full rounded-[10px] border border-line bg-paper px-3 py-2.5 text-sm focus:border-tomato focus:outline-none"
              placeholder="Sin cebolla, extra queso, etc."
            />
          </section>

          {error && (
            <p className="rounded-card border border-tomato/30 bg-tomato/5 p-3 text-sm text-tomato">
              {error}
            </p>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-panel border border-line bg-paper p-5 shadow-soft">
            <h2 className="text-sm font-semibold">Tu pedido</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-sm">
                  <span>
                    <span className="font-medium">
                      {item.quantity}x {item.name}
                    </span>
                    {item.variantName && (
                      <span className="block text-xs text-muted">{item.variantName}</span>
                    )}
                    {item.customizations && item.customizations.length > 0 && (
                      <span className="block text-xs text-muted">
                        {item.customizations.map((extra) => extra.name).join(' · ')}
                      </span>
                    )}
                  </span>
                  <span className="tabular shrink-0">
                    {formatMoney(item.unitPriceCents * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            {discountCents > 0 && (
              <div className="mt-4 flex justify-between text-sm text-basil">
                <span>Descuento ({code})</span>
                <span className="tabular font-medium">-{formatMoney(discountCents)}</span>
              </div>
            )}
            <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
              <span className="text-sm text-muted">Total</span>
              <span className="tabular text-2xl font-semibold text-ink">
                {formatMoney(finalCents)}
              </span>
            </div>
            {code && promo.error && (
              <p className="mt-2 text-xs text-amber">{promo.error}</p>
            )}
            {code && discountCents > 0 && (
              <p className="mt-2 text-xs text-basil">Código {code} aplicado.</p>
            )}
            <Button type="submit" size="lg" className="mt-4 w-full">
              Confirmar pedido
              <Icon name="arrow-right" size={18} />
            </Button>
            <p className="mt-3 text-center text-xs text-muted">
              Te daremos un folio para recoger.
            </p>
          </div>
        </aside>
      </form>
    </main>
  )
}
