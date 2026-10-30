'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { useOrders } from '@/hooks/useOrders'
import { formatMoney } from '@/lib/menu/products'
import { getMetrics } from '@/lib/orders/store'
import {
  ACTIVE_STATUSES,
  SOURCE_LABELS,
  STATUS_LABELS,
} from '@/lib/orders/types'

const MODULES: Array<{
  href: string
  title: string
  description: string
  icon: IconName
  accent: string
  cta: string
}> = [
  {
    href: '/interno/mostrador',
    title: 'Mostrador',
    description: 'Toma pedidos en local, cobra y manda la comanda a cocina.',
    icon: 'store',
    accent: 'bg-tomato/10 text-tomato',
    cta: 'Abrir POS',
  },
  {
    href: '/interno/cocina',
    title: 'Cocina',
    description: 'Comandas en vivo, semáforo de espera y cronómetro de horno.',
    icon: 'flame',
    accent: 'bg-amber/10 text-amber',
    cta: 'Abrir KDS',
  },
  {
    href: '/interno/dashboard',
    title: 'Dashboard',
    description: 'Ventas, ticket promedio, tiempos y productos más vendidos.',
    icon: 'chart',
    accent: 'bg-basil/10 text-basil',
    cta: 'Ver métricas',
  },
]

export default function InternalHomePage() {
  const orders = useOrders()
  const metrics = useMemo(() => getMetrics(orders), [orders])
  const active = orders.filter((order) => ACTIVE_STATUSES.includes(order.status)).length
  const inOven = orders.filter((order) => order.status === 'in_oven').length
  const counter = orders.filter((order) => order.source === 'counter').length
  const recent = orders.slice(0, 5)
  const lastDate = orders[0] ? new Date(orders[0].createdAt) : null

  const stats = [
    { value: active, label: 'comandas activas' },
    { value: inOven, label: 'en horno' },
    { value: counter, label: 'de mostrador' },
  ]

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Operación · PizzaFlow
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Centro de operaciones
            </h1>
            <p className="mt-1 text-sm text-muted">
              {lastDate
                ? `Turno con actividad: ${lastDate.toLocaleDateString('es-MX', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}`
                : 'Sin pedidos registrados todavía.'}
            </p>
          </div>
          <ButtonLink href="/" variant="secondary" size="md">
            <Icon name="arrow-left" size={16} />
            Ver sitio público
          </ButtonLink>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-card border border-line bg-paper p-4 shadow-soft"
            >
              <div className="tabular text-2xl font-semibold text-ink">{stat.value}</div>
              <div className="mt-0.5 text-xs text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {MODULES.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group flex flex-col rounded-panel border border-line bg-paper p-5 shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-[12px] ${module.accent}`}>
                <Icon name={module.icon} size={22} />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{module.title}</h2>
              <p className="mt-1 flex-1 text-sm leading-6 text-muted">{module.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-tomato">
                {module.cta}
                <Icon name="arrow-right" size={15} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-panel border border-line bg-paper p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Últimos pedidos</h2>
              <Link href="/interno/dashboard" className="text-xs text-muted hover:text-ink">
                Ver dashboard
              </Link>
            </div>
            {recent.length === 0 ? (
              <div className="mt-6 rounded-card border border-dashed border-line p-6 text-center text-sm text-muted">
                Aún no hay pedidos. Abre el POS o comparte el menú con tus clientes.
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {recent.map((order) => (
                  <li key={order.id} className="flex items-center gap-3 py-3">
                    <span className="tabular flex h-8 w-12 items-center justify-center rounded-[8px] bg-cream text-xs font-semibold">
                      #{order.orderNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{order.customerName}</div>
                      <div className="text-xs text-muted">
                        {SOURCE_LABELS[order.source]} · {order.items.length} partidas
                      </div>
                    </div>
                    <span className="rounded-full bg-cream px-2 py-1 text-[11px] font-medium text-muted">
                      {STATUS_LABELS[order.status]}
                    </span>
                    <span className="tabular w-20 text-right text-sm font-medium">
                      {formatMoney(order.totalCents)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className="rounded-panel border border-line bg-night p-5 text-white shadow-soft">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-basil" />
              Resumen del turno
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Ventas</span>
                <span className="tabular font-semibold">{formatMoney(metrics.revenueCents)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Ticket promedio</span>
                <span className="tabular font-semibold">
                  {formatMoney(metrics.averageTicketCents)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Tiempo promedio</span>
                <span className="tabular font-semibold">
                  {metrics.averagePrepMinutes
                    ? `${Math.round(metrics.averagePrepMinutes)} min`
                    : '—'}
                </span>
              </div>
            </div>
            <p className="mt-5 rounded-card border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-white/60">
              El sitio público y la operación están separados. Comparte solo el menú
              con tus clientes; esta área es para el equipo.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
