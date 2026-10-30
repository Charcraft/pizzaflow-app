'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useOvenClock } from '@/hooks/useOvenClock'
import { formatMoney } from '@/lib/menu/products'
import { Order, SOURCE_LABELS, STATUS_LABELS } from '@/lib/orders/types'

interface OrderCardProps {
  order: Order
  onUpdateStatus: (id: string, status: Order['status']) => void
  compact?: boolean
}

const STATUS_TONE: Record<string, string> = {
  pending: 'bg-sky-100 text-sky-800',
  confirmed: 'bg-sky-100 text-sky-800',
  preparing: 'bg-amber-100 text-amber-800',
  in_oven: 'bg-orange-100 text-orange-800',
  ready: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-stone-200 text-stone-700',
  cancelled: 'bg-red-100 text-red-700',
}

export function OrderCard({ order, onUpdateStatus, compact }: OrderCardProps) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const createdAt = new Date(order.createdAt)
  const elapsedMinutes = now === null ? 0 : (now - createdAt.getTime()) / 60000

  let semaphore = 'bg-emerald-500'
  if (elapsedMinutes > 2) semaphore = 'bg-red-500'
  else if (elapsedMinutes > 1) semaphore = 'bg-amber-500'

  const ovenClock = useOvenClock(order.ovenStartedAt)

  return (
    <article className="flex flex-col rounded-card border border-line bg-paper p-4 text-ink shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${semaphore}`} />
            <span className="tabular text-lg font-semibold">#{order.orderNumber}</span>
            <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
              {SOURCE_LABELS[order.source]}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {order.customerName}
            {order.tableNumber ? ` · Mesa ${order.tableNumber}` : ''}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              STATUS_TONE[order.status] ?? 'bg-cream text-muted'
            }`}
          >
            {STATUS_LABELS[order.status]}
          </span>
          <p className="tabular mt-1 text-[11px] text-muted">
            {createdAt.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {!compact && (
        <>
          <ul className="mt-3 space-y-1">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2 text-sm">
                <span>
                  {item.quantity}x {item.name}
                  {item.variantName ? (
                    <span className="text-xs text-muted"> ({item.variantName})</span>
                  ) : null}
                  {item.customizations && item.customizations.length > 0 ? (
                    <span className="block text-[11px] text-muted">
                      {item.customizations.map((extra) => extra.name).join(' · ')}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>

          {order.ovenStartedAt && (
            <div
              className={`mt-3 flex items-center justify-between rounded-[9px] border px-3 py-2 ${
                ovenClock.triggered200
                  ? 'border-red-300 bg-red-50'
                  : ovenClock.triggered130
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-line bg-cream'
              }`}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <Icon
                  name="flame"
                  size={14}
                  className={ovenClock.triggered200 ? 'text-red-600' : 'text-tomato'}
                />
                Horno
              </span>
              <span
                className={`tabular text-lg font-semibold ${
                  ovenClock.triggered200 ? 'text-red-700' : 'text-ink'
                }`}
              >
                {ovenClock.formatted}
              </span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <span className="tabular text-base font-semibold">{formatMoney(order.totalCents)}</span>
            <div className="flex gap-2">
              {order.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(order.id, 'confirmed')}
                  className="h-8 rounded-[8px] bg-ink px-3 text-xs font-medium text-white hover:bg-night-soft"
                >
                  Confirmar
                </button>
              )}
              {order.status === 'confirmed' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(order.id, 'preparing')}
                  className="h-8 rounded-[8px] bg-amber px-3 text-xs font-medium text-white hover:opacity-90"
                >
                  Preparando
                </button>
              )}
              {order.status === 'preparing' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(order.id, 'in_oven')}
                  className="h-8 rounded-[8px] bg-tomato px-3 text-xs font-medium text-white hover:bg-tomato-deep"
                >
                  En horno
                </button>
              )}
              {order.status === 'in_oven' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(order.id, 'ready')}
                  className="h-8 rounded-[8px] bg-basil px-3 text-xs font-medium text-white hover:opacity-90"
                >
                  Lista
                </button>
              )}
              {order.status === 'ready' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(order.id, 'completed')}
                  className="h-8 rounded-[8px] bg-night px-3 text-xs font-medium text-white hover:bg-night-soft"
                >
                  Entregado
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </article>
  )
}
