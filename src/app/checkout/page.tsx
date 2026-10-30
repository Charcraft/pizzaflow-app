'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { createOrder } from '@/lib/orders/store'
import type { PaymentMethod } from '@/lib/orders/types'
import { formatMoney } from '@/lib/menu/products'

const PAYMENT_LABELS: Record<Exclude<PaymentMethod, 'pending'>, string> = {
  cash: 'Efectivo al recoger',
  card: 'Tarjeta al recoger',
  transfer: 'Transferencia',
}

export default function CheckoutPage() {
  const { items, totalCents, clearCart } = useCart()
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<Exclude<PaymentMethod, 'pending'>>('cash')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!customerName.trim()) {
      setError('Escribe el nombre de quien recoge el pedido.')
      return
    }

    const order = createOrder({
      source: 'web',
      customerName,
      customerPhone,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        variantId: item.variantId,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        customizations: item.customizations,
      })),
      paymentMethod,
      paymentStatus: 'pending',
      notes,
    })

    clearCart()
    router.push(`/order/${order.id}`)
  }

  if (!items.length) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrito vacío</h1>
          <Link href="/menu" className="px-6 py-3 bg-red-600 text-white rounded-lg">
            Ver Menú
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/cart" className="text-sm text-red-600 hover:underline">
          ← Volver al carrito
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-8">
          Checkout · Recoger en mostrador
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="font-semibold mb-4">Datos de quien recoge</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="customer-name">
                    Nombre *
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="customer-phone">
                    Teléfono (opcional)
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="55 1234 5678"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="font-semibold mb-4">Método de pago</h2>
              <div className="space-y-2">
                {(Object.keys(PAYMENT_LABELS) as Array<keyof typeof PAYMENT_LABELS>).map(
                  (method) => (
                    <label
                      key={method}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                      />
                      <span>{PAYMENT_LABELS[method]}</span>
                    </label>
                  ),
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                No se guardan datos de tarjeta. El pago se realiza al recoger.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <label className="block font-semibold mb-2" htmlFor="notes">
                Notas para cocina (opcional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Sin cebolla, extra queso, etc."
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
            >
              Confirmar pedido · {formatMoney(totalCents)}
            </button>
          </form>

          <div className="bg-white rounded-xl p-6 border border-gray-200 h-fit">
            <h2 className="font-semibold mb-4">Resumen del pedido</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
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
                  <span>{formatMoney(item.unitPriceCents * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatMoney(totalCents)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Recoger en mostrador en aprox. 15-25 min.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
