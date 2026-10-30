'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { usePromo } from '@/hooks/usePromo'
import { formatMoney } from '@/lib/menu/products'
import { getPromoDiscount } from '@/lib/promotions'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PizzaArt } from '@/components/public/PizzaArt'

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalCents, totalItems, clearCart } = useCart()
  const { code, applyCode, clearPromo } = usePromo()
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')

  const promo = getPromoDiscount(code, totalCents)
  const finalCents = totalCents - promo.discountCents

  const handleApplyPromo = () => {
    if (applyCode(promoInput)) {
      setPromoError('')
      setPromoInput('')
    } else {
      setPromoError('Código no válido.')
    }
  }

  const handleClearCart = () => {
    clearCart()
    clearPromo()
  }

  if (!items.length) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center sm:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-panel bg-paper text-tomato shadow-soft">
          <Icon name="bag" size={30} />
        </span>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-ink">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted">
          Empieza por una pizza. Puedes personalizar tamaño, extras y mitad/mitad.
        </p>
        <ButtonLink href="/menu" size="lg" className="mt-6">
          Ver el menú
          <Icon name="arrow-right" size={18} />
        </ButtonLink>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
            Carrito
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink sm:text-5xl">
            Tu pedido
          </h1>
          <p className="mt-1 text-sm text-muted">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'} · Recoger en mostrador
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearCart}
          className="text-xs text-muted underline-offset-4 hover:text-tomato hover:underline"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 rounded-card border border-line bg-paper p-4 shadow-soft sm:flex-row sm:items-center"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[12px] bg-[#F6E3C5] p-1.5">
                <PizzaArt className="h-full" rotation={(Number(item.productId) * 11) % 18 - 9} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-ink">{item.name}</h2>
                <p className="mt-0.5 text-xs text-muted">
                  {item.variantName ? `${item.variantName} · ` : ''}
                  {formatMoney(item.unitPriceCents)} c/u
                </p>
                {item.customizations && item.customizations.length > 0 && (
                  <p className="mt-1 text-xs text-muted">
                    {item.customizations.map((extra) => extra.name).join(' · ')}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-line hover:bg-cream"
                    aria-label={`Quitar una unidad de ${item.name}`}
                  >
                    <Icon name="minus" size={14} />
                  </button>
                  <span className="tabular w-7 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-line hover:bg-cream"
                    aria-label={`Agregar una unidad de ${item.name}`}
                  >
                    <Icon name="plus" size={14} />
                  </button>
                </div>
                <span className="tabular w-20 text-right text-sm font-semibold">
                  {formatMoney(item.unitPriceCents * item.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted hover:bg-tomato/5 hover:text-tomato"
                  aria-label={`Eliminar ${item.name}`}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </article>
          ))}

          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-tomato hover:underline"
          >
            <Icon name="arrow-left" size={15} />
            Seguir eligiendo
          </Link>
        </section>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-panel border border-line bg-paper p-5 shadow-soft">
            <h2 className="text-sm font-semibold">Resumen</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular font-medium">{formatMoney(totalCents)}</dd>
              </div>
              {promo.discountCents > 0 && (
                <div className="flex justify-between text-basil">
                  <dt>Descuento ({code})</dt>
                  <dd className="tabular font-medium">-{formatMoney(promo.discountCents)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Envío</dt>
                <dd className="text-muted">No aplica</dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-line pt-4">
              <label
                className="mb-1.5 block text-xs font-medium text-muted"
                htmlFor="promo-code"
              >
                Código promocional
              </label>
              {code ? (
                <div className="flex items-center justify-between gap-2 rounded-[10px] border border-basil/30 bg-basil/5 px-3 py-2">
                  <span className="text-sm font-medium text-basil">{code}</span>
                  <button
                    type="button"
                    onClick={clearPromo}
                    className="text-xs text-muted underline-offset-4 hover:text-tomato hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    id="promo-code"
                    type="text"
                    value={promoInput}
                    onChange={(event) => setPromoInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        handleApplyPromo()
                      }
                    }}
                    placeholder="BIENVENIDO10"
                    className="h-10 min-w-0 flex-1 rounded-[9px] border border-line bg-cream px-3 text-sm uppercase focus:border-tomato focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="h-10 shrink-0 rounded-[9px] border border-line px-3 text-xs font-medium text-ink hover:bg-cream"
                  >
                    Aplicar
                  </button>
                </div>
              )}
              {promoError && <p className="mt-2 text-xs text-tomato">{promoError}</p>}
              {code && promo.error && <p className="mt-2 text-xs text-amber">{promo.error}</p>}
              {code && promo.discountCents > 0 && (
                <p className="mt-2 text-xs text-basil">
                  Ahorras {formatMoney(promo.discountCents)} con este código.
                </p>
              )}
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
              <span className="text-sm text-muted">Total</span>
              <span className="tabular text-2xl font-semibold text-ink">
                {formatMoney(finalCents)}
              </span>
            </div>
            <ButtonLink href="/checkout" size="lg" className="mt-4 w-full">
              Ir al checkout
              <Icon name="arrow-right" size={18} />
            </ButtonLink>
            <div className="mt-4 flex items-start gap-2 rounded-card bg-cream p-3 text-xs leading-5 text-muted">
              <Icon name="clock" size={15} className="mt-0.5 shrink-0" />
              <span>Recoge en mostrador en 15-25 min. Pagas al recoger.</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
