'use client'

import { Order, STATUS_LABELS, SOURCE_LABELS } from '@/lib/orders/types'
import { useOvenClock } from '@/hooks/useOvenClock'
import { formatMoney } from '@/lib/menu/products'
import { useEffect, useState } from 'react'

interface OrderCardProps {
  order: Order
  onUpdateStatus: (id: string, status: Order['status']) => void
  compact?: boolean
}

export function OrderCard({ order, onUpdateStatus, compact }: OrderCardProps) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const createdAt = new Date(order.createdAt)
  const elapsedMinutes = now === null ? 0 : (now - createdAt.getTime()) / 60000
  
  let semaphore = 'bg-green-500'
  if (elapsedMinutes > 2) semaphore = 'bg-red-500'
  else if (elapsedMinutes > 1) semaphore = 'bg-amber-500'

  const ovenClock = useOvenClock(order.ovenStartedAt)

  const itemsText = order.items
    .map(i => `${i.quantity}x ${i.name}`)
    .join(', ')

  return (
    <div className="bg-white text-gray-900 rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${semaphore}`} />
            <span className="font-bold text-lg">#{order.orderNumber}</span>
            <span className="text-sm text-gray-500">{SOURCE_LABELS[order.source]}</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {order.customerName} {order.tableNumber ? `· Mesa ${order.tableNumber}` : ''}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{STATUS_LABELS[order.status]}</div>
          <div className="text-xs text-gray-500">
            {createdAt.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <div className="text-sm text-gray-700 mb-3">
            {itemsText}
          </div>
          
          {order.ovenStartedAt && (
            <div className={`mb-3 p-2 rounded-lg ${
              ovenClock.triggered200 ? 'bg-red-100 border border-red-300' :
              ovenClock.triggered130 ? 'bg-amber-100 border border-amber-300' :
              'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Horno</span>
                <span className={`text-lg font-mono font-bold ${
                  ovenClock.triggered200 ? 'text-red-700' : ''
                }`}>
                  {ovenClock.formatted}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="font-bold text-lg">{formatMoney(order.totalCents)}</span>
            <div className="flex gap-2">
              {order.status === 'pending' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'confirmed')}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirmar
                </button>
              )}
              {order.status === 'confirmed' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'preparing')}
                  className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Preparando
                </button>
              )}
              {order.status === 'preparing' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'in_oven')}
                  className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  En horno
                </button>
              )}
              {order.status === 'in_oven' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'ready')}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Lista
                </button>
              )}
              {order.status === 'ready' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'completed')}
                  className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                >
                  Entregado
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
