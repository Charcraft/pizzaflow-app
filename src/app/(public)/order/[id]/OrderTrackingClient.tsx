'use client'

import Link from 'next/link'
import { useOrders } from '@/hooks/useOrders'
import { formatMoney } from '@/lib/menu/products'
import { SOURCE_LABELS, STATUS_LABELS, type OrderStatus } from '@/lib/orders/types'
import { buildOrderWhatsAppUrl } from '@/lib/orders/whatsapp'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

const STEPS: Array<{ key: OrderStatus; label: string; icon: 'receipt' | 'clock' | 'flame' | 'check' | 'bag' }> = [
  { key: 'pending', label: 'Recibido', icon: 'receipt' },
  { key: 'preparing', label: 'En preparación', icon: 'clock' },
  { key: 'in_oven', label: 'En horno', icon: 'flame' },
  { key: 'ready', label: 'Listo para recoger', icon: 'check' },
  { key: 'completed', label: 'Entregado', icon: 'bag' },
]

function stepIndex(status: OrderStatus): number {
  if (status === 'confirmed') return 0
  return STEPS.findIndex((step) => step.key === status)
}

export function OrderTrackingClient({ orderId }: { orderId: string }) {
  const orders = useOrders()
  const order = orders.find((item) => item.id === orderId)

  if (!order) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center sm:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-panel bg-paper text-tomato shadow-soft">
          <Icon name="receipt" size={30} />
        </span>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-ink">
          Pedido no encontrado
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted">
          Este pedido no existe en este dispositivo. Revisa el enlace o vuelve a
          empezar.
        </p>
        <ButtonLink href="/menu" size="lg" className="mt-6">
          Ver el menú
        </ButtonLink>
      </main>
    )
  }

  const currentStep = stepIndex(order.status)
  const cancelled = order.status === 'cancelled'
  const createdAt = new Date(order.createdAt)
  const estimated = new Date(createdAt.getTime() + 25 * 60_000)

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/menu" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <Icon name="arrow-left" size={15} />
        Volver al menú
      </Link>

      <section className="mt-4 overflow-hidden rounded-panel border border-line bg-paper shadow-soft">
        <div className="border-b border-line bg-cream/60 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Folio
              </p>
              <h1 className="tabular mt-1 font-display text-5xl tracking-tight text-ink">
                #{order.orderNumber}
              </h1>
              <p className="mt-2 text-sm text-muted">
                {SOURCE_LABELS[order.source]} · {order.customerName}
              </p>
            </div>
            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                cancelled
                  ? 'bg-tomato/10 text-tomato'
                  : order.status === 'ready'
                    ? 'bg-basil/10 text-basil'
                    : 'bg-amber/10 text-amber'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  cancelled ? 'bg-tomato' : order.status === 'ready' ? 'bg-basil' : 'bg-amber'
                }`}
              />
              {STATUS_LABELS[order.status]}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-card border border-line bg-paper p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Icon name="receipt" size={14} />
                Hora del pedido
              </div>
              <div className="tabular mt-1 text-sm font-semibold">
                {createdAt.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="rounded-card border border-line bg-paper p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Icon name="clock" size={14} />
                Recoger aprox.
              </div>
              <div className="tabular mt-1 text-sm font-semibold">
                {estimated.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {!cancelled ? (
            <ol className="space-y-4">
              {STEPS.map((step, index) => {
                const done = index <= currentStep
                const current = index === currentStep
                return (
                  <li key={step.key} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        done ? 'bg-basil text-white' : 'bg-cream text-muted'
                      }`}
                    >
                      <Icon name={step.icon} size={16} />
                    </span>
                    <div>
                      <div
                        className={`text-sm font-medium ${done ? 'text-ink' : 'text-muted'}`}
                      >
                        {step.label}
                        {current && (
                          <span className="ml-2 rounded-full bg-amber/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber">
                            Ahora
                          </span>
                        )}
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className={`mt-2 h-4 w-px ${done ? 'bg-basil/40' : 'bg-line'}`} />
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          ) : (
            <p className="rounded-card border border-tomato/30 bg-tomato/5 p-3 text-sm text-tomato">
              Este pedido fue cancelado. Si fue un error, habla con mostrador.
            </p>
          )}

          <div className="mt-8 border-t border-line pt-6">
            <h2 className="text-sm font-semibold">Tu pedido</h2>
            <div className="mt-3 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-sm">
                  <span>
                    {item.quantity}x {item.name}
                    {item.variantName ? ` (${item.variantName})` : ''}
                    {item.customizations && item.customizations.length > 0 ? (
                      <span className="block text-xs text-muted">
                        {item.customizations.map((extra) => extra.name).join(' · ')}
                      </span>
                    ) : null}
                  </span>
                  <span className="tabular shrink-0">{formatMoney(item.totalPriceCents)}</span>
                </div>
              ))}
            </div>
            {order.discountCents > 0 && (
              <div className="mt-3 flex justify-between text-sm text-basil">
                <span>
                  Descuento {order.promoCode ? `(${order.promoCode})` : ''}
                </span>
                <span className="tabular">-{formatMoney(order.discountCents)}</span>
              </div>
            )}
            <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-semibold">
              <span>Total</span>
              <span className="tabular">{formatMoney(order.totalCents)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Pago:{' '}
              {order.paymentMethod === 'cash'
                ? 'Efectivo'
                : order.paymentMethod === 'card'
                  ? 'Tarjeta'
                  : order.paymentMethod === 'transfer'
                    ? 'Transferencia'
                    : 'Pendiente'}{' '}
              · {order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente de pago'}
            </p>
            {order.notes && (
              <p className="mt-3 rounded-card border border-amber/30 bg-amber/5 p-3 text-sm text-amber">
                Nota: {order.notes}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-card border border-line bg-paper p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            <Icon name="map-pin" size={14} />
            Dónde recoger
          </div>
          <p className="mt-2 text-sm text-ink">Mostrador PizzaFlow</p>
          <p className="text-xs text-muted">Muestra tu folio #{order.orderNumber} al llegar.</p>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-card border border-line bg-paper p-4">
          <div>
            <p className="text-sm font-medium">¿Otro pedido?</p>
            <p className="text-xs text-muted">Vuelve al menú cuando quieras.</p>
          </div>
          <ButtonLink href="/menu" variant="secondary" size="sm">
            Pedir de nuevo
          </ButtonLink>
        </div>
      </div>

      <a
        href={buildOrderWhatsAppUrl(order)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-between gap-3 rounded-card border border-basil/30 bg-basil/5 p-4 transition-colors hover:bg-basil/10"
      >
        <div>
          <p className="text-sm font-medium text-basil">Enviar pedido por WhatsApp</p>
          <p className="text-xs text-muted">
            Abre el chat del dueño con el folio, los productos y el total.
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-basil text-white">
          <Icon name="phone" size={16} />
        </span>
      </a>
    </main>
  )
}
