'use client'

import { useCart } from '@/hooks/useCart'
import { useState } from 'react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, totalCents, clearCart } = useCart()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cents / 100)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Create order in Supabase
    alert(`Pedido creado para ${customerName}\nTotal: ${formatPrice(totalCents)}\nMétodo: ${paymentMethod}`)
    clearCart()
  }

  if (!items.length) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrito vacío</h1>
          <Link href="/menu" className="px-6 py-3 bg-red-600 text-white rounded-lg">Ver Menú</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout - Recoger en mostrador</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="font-semibold mb-4">Datos del cliente</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="55 1234 5678"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="font-semibold mb-4">Método de pago</h2>
              <div className="space-y-2">
                {['cash', 'card', 'transfer'].map(method => (
                  <label key={method} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    <span className="capitalize">{method === 'cash' ? 'Efectivo' : method === 'card' ? 'Tarjeta' : 'Transferencia'}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
            >
              Confirmar Pedido - {formatPrice(totalCents)}
            </button>
          </form>

          <div className="bg-white rounded-xl p-6 border border-gray-200 h-fit">
            <h2 className="font-semibold mb-4">Resumen del pedido</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{formatPrice(item.unitPriceCents * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(totalCents)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Recoger en mostrador en aprox. 15-25 min
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}