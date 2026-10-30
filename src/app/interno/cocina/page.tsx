'use client'

import { Icon } from '@/components/ui/Icon'
import { OrderCard } from '@/components/orders/OrderCard'
import { useOrders } from '@/hooks/useOrders'
import { updateOrderStatus } from '@/lib/orders/store'
import { ACTIVE_STATUSES, type OrderStatus } from '@/lib/orders/types'

export default function CocinaPage() {
  const orders = useOrders()

  const activeOrders = orders
    .filter((order) => ACTIVE_STATUSES.includes(order.status))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status)
  }

  const counts = [
    {
      label: 'Nuevos',
      value: activeOrders.filter((order) => order.status === 'pending' || order.status === 'confirmed').length,
      icon: 'receipt' as const,
      color: 'text-sky-300',
      bg: 'bg-sky-400/10',
    },
    {
      label: 'Preparando',
      value: activeOrders.filter((order) => order.status === 'preparing').length,
      icon: 'clock' as const,
      color: 'text-amber-300',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'En horno',
      value: activeOrders.filter((order) => order.status === 'in_oven').length,
      icon: 'flame' as const,
      color: 'text-orange-300',
      bg: 'bg-orange-400/10',
    },
    {
      label: 'Listos',
      value: activeOrders.filter((order) => order.status === 'ready').length,
      icon: 'check' as const,
      color: 'text-emerald-300',
      bg: 'bg-emerald-400/10',
    },
  ]

  return (
    <main className="min-h-screen bg-night p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
              Operación · KDS
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Cocina</h1>
            <p className="mt-1 text-sm text-white/50">
              Orden FIFO. El color cambia con el tiempo de espera.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> &lt; 1 min
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> 1-2 min
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> &gt; 2 min
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {counts.map((card) => (
            <div
              key={card.label}
              className="rounded-card border border-white/10 bg-night-soft p-4"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-[9px] ${card.bg} ${card.color}`}>
                <Icon name={card.icon} size={18} />
              </div>
              <div className="tabular mt-3 text-2xl font-semibold">{card.value}</div>
              <div className="mt-0.5 text-xs text-white/50">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>

        {activeOrders.length === 0 && (
          <div className="mt-10 flex flex-col items-center rounded-panel border border-dashed border-white/15 py-20 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/40">
              <Icon name="pizza" size={28} />
            </span>
            <p className="mt-4 text-sm font-medium text-white/70">Sin pedidos pendientes</p>
            <p className="mt-1 text-xs text-white/40">
              Las comandas nuevas aparecen aquí automáticamente.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
