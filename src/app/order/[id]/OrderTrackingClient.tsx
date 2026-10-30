'use client'

import Link from 'next/link'
import { useOrders } from '@/hooks/useOrders'
import { formatMoney } from '@/lib/menu/products'
import { SOURCE_LABELS, STATUS_LABELS, type OrderStatus } from '@/lib/orders/types'

const STEPS: Array<{ key: OrderStatus; label: string }> = [
  { key: 'pending', label: 'Recibido' },
  { key: 'preparing', label: 'En preparación' },
  { key: 'in_oven', label: 'En horno' },
  { key: 'ready', label: 'Listo para recoger' },
  { key: 'completed', label: 'Entregado' },
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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedido no encontrado</h1>
          <p className="text-gray-600 mb-6">
            El pedido no existe en este dispositivo o fue eliminado.
          </p>
          <Link href="/menu" className="px-6 py-3 bg-red-600 text-white rounded-lg">
            Volver al menú
          </Link>
        </div>
      </main>
    )
  }

  const currentStep = stepIndex(order.status)
  const cancelled = order.status === 'cancelled'
  const createdAt = new Date(order.createdAt)
  const estimated = new Date(createdAt.getTime() + 25 * 60_000)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/menu" className="text-sm text-red-600 hover:underline">
          ← Volver al menú
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">Folio</p>
              <h1 className="text-3xl font-bold text-gray-900">#{order.orderNumber}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {SOURCE_LABELS[order.source]} · {order.customerName}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                cancelled
                  ? 'bg-red-100 text-red-700'
                  : order.status === 'ready'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-800'
              }`}
            >
              {STATUS_LABELS[order.status]}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500">Hora del pedido</div>
              <div className="font-medium">
                {createdAt.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500">Recoger aprox.</div>
              <div className="font-medium">
                {estimated.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {!cancelled && (
            <ol className="mt-6 space-y-3">
              {STEPS.map((step, index) => {
                const done = index <= currentStep
                return (
                  <li key={step.key} className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        done ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {done ? '✓' : index + 1}
                    </span>
                    <span className={done ? 'font-medium text-gray-900' : 'text-gray-500'}>
                      {step.label}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}

          <div className="mt-6 border-t pt-4">
            <h2 className="font-semibold mb-3">Tu pedido</h2>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                    {item.variantName ? ` (${item.variantName})` : ''}
                    {item.customizations?.length ? (
                      <span className="block text-xs text-gray-500">
                        {item.customizations.map((extra) => extra.name).join(', ')}
                      </span>
                    ) : null}
                  </span>
                  <span>{formatMoney(item.totalPriceCents)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 border-t pt-3">
              <span>Total</span>
              <span>{formatMoney(order.totalCents)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
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
              <p className="text-sm text-gray-600 mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                Nota: {order.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
