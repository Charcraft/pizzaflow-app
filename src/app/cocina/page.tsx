'use client'

import { useOrders } from '@/hooks/useOrders'
import { OrderCard } from '@/components/orders/OrderCard'
import { updateOrderStatus } from '@/lib/orders/store'
import { ACTIVE_STATUSES, type OrderStatus } from '@/lib/orders/types'

export default function CocinaPage() {
  const orders = useOrders()

  const activeOrders = orders
    .filter(o => ACTIVE_STATUSES.includes(o.status))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status)
  }

  const counts = {
    nuevos: activeOrders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
    preparando: activeOrders.filter(o => o.status === 'preparing').length,
    horno: activeOrders.filter(o => o.status === 'in_oven').length,
    listo: activeOrders.filter(o => o.status === 'ready').length,
  }



  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">KDS Cocina</h1>
          <div className="text-sm text-gray-400">PB-04 / PB-05 / PB-06</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Nuevos', value: counts.nuevos, color: 'bg-blue-600' },
            { label: 'Preparando', value: counts.preparando, color: 'bg-yellow-600' },
            { label: 'En horno', value: counts.horno, color: 'bg-orange-600' },
            { label: 'Listos', value: counts.listo, color: 'bg-green-600' },
          ].map(card => (
            <div key={card.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className={`text-3xl font-bold ${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-2`}>
                {card.value}
              </div>
              <div className="text-sm text-gray-400">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>

        {activeOrders.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">🍕</div>
            <p>Sin pedidos pendientes</p>
          </div>
        )}
      </div>
    </main>
  )
}
