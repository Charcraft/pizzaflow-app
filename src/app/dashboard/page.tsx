'use client'

import { useMemo } from 'react'
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

  const cards = [
    { label: 'Pedidos hoy', value: metrics.totalOrders.toString(), color: 'bg-blue-600' },
    { label: 'Ventas hoy', value: formatMoney(metrics.revenueCents), color: 'bg-green-600' },
    { label: 'Ticket promedio', value: formatMoney(metrics.averageTicketCents), color: 'bg-purple-600' },
    { label: 'Tiempo promedio', value: metrics.averagePrepMinutes ? `${Math.round(metrics.averagePrepMinutes)} min` : '—', color: 'bg-orange-600' },
  ]

  const maxTop = Math.max(...metrics.topProducts.map(p => p.quantity), 1)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Dueño</h1>
          <div className="text-xs text-gray-500">
            {lastUpdate ? `Último pedido: ${lastUpdate}` : 'Sin pedidos registrados'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className={`w-12 h-12 rounded-lg ${card.color} mb-3`} />
              <div className="text-sm text-gray-600">{card.label}</div>
              <div className="text-2xl font-bold mt-1">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Pedidos por estado</h3>
            <div className="space-y-3">
              {Object.entries(metrics.byStatus).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{STATUS_LABELS[status as OrderStatus] ?? status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${Math.min(100, (count / Math.max(...Object.values(metrics.byStatus), 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Top productos</h3>
            <div className="space-y-3">
              {metrics.topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{product.name}</div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(product.quantity / maxTop) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium">{product.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center">
          PB-08 Corte de caja / PB-16 Tablero tiempos • Datos demo localStorage
        </div>
      </div>
    </main>
  )
}