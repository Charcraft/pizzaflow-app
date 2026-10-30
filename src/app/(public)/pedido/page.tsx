'use client'

import Link from 'next/link'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { useOrders } from '@/hooks/useOrders'
import { useSession } from '@/hooks/useSession'
import { formatMoney } from '@/lib/menu/products'
import { SOURCE_LABELS, STATUS_LABELS } from '@/lib/orders/types'

export default function MyOrdersPage() {
  const session = useSession()
  const allOrders = useOrders()

  if (!session) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-panel bg-paper text-tomato shadow-soft">
          <Icon name="receipt" size={30} />
        </span>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-ink">
          Entra para ver tus pedidos
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          Inicia sesión o crea tu cuenta para guardar el historial y seguir tus
          pedidos.
        </p>
        <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
          <ButtonLink href="/entrar" size="lg">
            Iniciar sesión
          </ButtonLink>
          <ButtonLink href="/registro" variant="secondary" size="lg">
            Crear cuenta
          </ButtonLink>
        </div>
      </main>
    )
  }

  const orders = allOrders.filter((order) => {
    if (order.isDemo) return false
    if (session.role === 'customer') return order.customerEmail === session.email
    return true
  })

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">
            Mi pedido
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink sm:text-5xl">
            Pedidos de {session.name.split(' ')[0]}.
          </h1>
          <p className="mt-2 text-sm text-muted">
            Los pedidos hechos con {session.email}.
          </p>
        </div>
        <ButtonLink href="/menu" size="md">
          Pedir ahora
          <Icon name="arrow-right" size={16} />
        </ButtonLink>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-panel border border-dashed border-line bg-paper p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-panel bg-cream text-tomato">
            <Icon name="receipt" size={26} />
          </span>
          <p className="mt-4 font-medium text-ink">Todavía no hay pedidos.</p>
          <p className="mt-1 text-sm text-muted">
            Cuando hagas uno, aparecerá aquí con su folio y estado.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/order/${order.id}`}
                className="flex flex-col gap-3 rounded-card border border-line bg-paper p-4 shadow-soft transition-transform duration-200 hover:-translate-y-0.5 sm:flex-row sm:items-center"
              >
                <span className="tabular flex h-11 w-16 shrink-0 items-center justify-center rounded-[10px] bg-cream text-sm font-semibold">
                  #{order.orderNumber}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{order.customerName}</span>
                    <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] text-muted">
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {SOURCE_LABELS[order.source]} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    · {order.items.length} partidas
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="tabular text-sm font-semibold">
                    {formatMoney(order.totalCents)}
                  </span>
                  <Icon name="chevron-right" size={16} className="text-muted" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
