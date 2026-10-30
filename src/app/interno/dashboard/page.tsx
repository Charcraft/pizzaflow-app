'use client'

import { useMemo } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { useOrders } from '@/hooks/useOrders'
import { getMetrics } from '@/lib/orders/store'
import { formatMoney } from '@/lib/menu/products'
import { STATUS_LABELS, type OrderStatus } from '@/lib/orders/types'

function formatIsoTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DashboardPage() {
  const orders = useOrders()
  const metrics = useMemo(() => getMetrics(orders), [orders])
  const lastUpdate = orders[0] ? formatIsoTime(orders[0].updatedAt) : null

  const cards: Array<{
    label: string
    value: string
    icon: IconName
    color: string
    bg: string
  }> = [
    {
      label: 'Pedidos hoy',
      value: metrics.totalOrders.toString(),
      icon: 'receipt',
      color: 'text-tomato',
      bg: 'bg-tomato/10',
    },
    {
      label: 'Ventas hoy',
      value: formatMoney(metrics.revenueCents),
      icon: 'chart',
      color: 'text-basil',
      bg: 'bg-basil/10',
    },
    {
      label: 'Ticket promedio',
      value: formatMoney(metrics.averageTicketCents),
      icon: 'bag',
      color: 'text-amber',
      bg: 'bg-amber/10',
    },
    {
      label: 'Tiempo promedio',
      value: metrics.averagePrepMinutes ? `${Math.round(metrics.averagePrepMinutes)} min` : '—',
      icon: 'clock',
      color: 'text-ink',
      bg: 'bg-ink/5',
    },
  ]

  const maxTop = Math.max(...metrics.topProducts.map((product) => product.quantity), 1)
  const maxStatus = Math.max(...Object.values(metrics.byStatus), 1)

  const statusOrder: OrderStatus[] = [
    'pending',
    'confirmed',
    'preparing',
    'in_oven',
    'ready',
    'completed',
    'cancelled',
  ]

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Operación · Métricas
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted">
              {lastUpdate ? `Último movimiento a las ${lastUpdate}` : 'Sin pedidos registrados'}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-card border border-line bg-paper px-3 py-2 text-xs text-muted shadow-soft">
            <Icon name="chart" size={14} />
            Datos del turno · actualización en vivo
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-card border border-line bg-paper p-5 shadow-soft"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${card.bg} ${card.color}`}>
                <Icon name={card.icon} size={19} />
              </div>
              <div className="mt-4 text-xs text-muted">{card.label}</div>
              <div className="tabular mt-1 text-2xl font-semibold tracking-tight">
                {card.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <section className="rounded-panel border border-line bg-paper p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Pedidos por estado</h2>
              <span className="text-xs text-muted">{metrics.totalOrders} activos</span>
            </div>
            <div className="mt-5 space-y-3">
              {statusOrder.map((status) => {
                const count = metrics.byStatus[status] ?? 0
                return (
                  <div key={status}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted">{STATUS_LABELS[status]}</span>
                      <span className="tabular font-semibold">{count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-cream">
                      <div
                        className="h-full rounded-full bg-tomato"
                        style={{ width: `${Math.min(100, (count / maxStatus) * 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-panel border border-line bg-paper p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Top productos</h2>
              <span className="text-xs text-muted">por unidades</span>
            </div>
            {metrics.topProducts.length === 0 ? (
              <p className="mt-6 rounded-card border border-dashed border-line p-6 text-center text-xs text-muted">
                Aún no hay ventas para calcular el top.
              </p>
            ) : (
              <ol className="mt-5 space-y-4">
                {metrics.topProducts.map((product, index) => (
                  <li key={product.name} className="flex items-center gap-3">
                    <span className="tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream text-xs font-semibold text-muted">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{product.name}</span>
                        <span className="tabular text-xs font-semibold">{product.quantity}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream">
                        <div
                          className="h-full rounded-full bg-ink"
                          style={{ width: `${(product.quantity / maxTop) * 100}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <section className="mt-5 rounded-panel border border-line bg-paper p-5 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Lectura rápida</h2>
              <p className="mt-1 text-xs text-muted">
                Si el tiempo promedio sube de 25 min o hay más de 6 comandas activas,
                refuerza cocina.
              </p>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-xs text-muted">En horno</div>
                <div className="tabular text-xl font-semibold">{metrics.byStatus.in_oven}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Listos</div>
                <div className="tabular text-xl font-semibold">{metrics.byStatus.ready}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Promedio</div>
                <div className="tabular text-xl font-semibold">
                  {metrics.averagePrepMinutes ? `${Math.round(metrics.averagePrepMinutes)}′` : '—'}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
