'use client'

import { useCart } from '@/hooks/useCart'
import Link from 'next/link'

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalCents, totalItems, clearCart } = useCart()

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cents / 100)
  }

  if (!items.length) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-6">Agrega productos desde el menú</p>
          <Link href="/menu" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Ver Menú
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tu Carrito</h1>
        
        <div className="space-y-4 mb-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                {item.variantName && (
                  <p className="text-sm text-gray-600">{item.variantName}</p>
                )}
                <p className="text-sm text-gray-600">{formatPrice(item.unitPriceCents)} c/u</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-red-600 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Subtotal ({totalItems} items)</span>
            <span className="text-2xl font-bold">{formatPrice(totalCents)}</span>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={clearCart}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Vaciar carrito
            </button>
            <Link
              href="/checkout"
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-center font-medium"
            >
              Proceder al checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}