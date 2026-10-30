'use client'

import { useState, useMemo } from 'react'
import { DEMO_PRODUCTS, formatMoney } from '@/lib/menu/products'
import { createOrder } from '@/lib/orders/store'
import { useCart } from '@/hooks/useCart'
import type { CreateOrderInput } from '@/lib/orders/types'

export default function MostradorPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [customerName, setCustomerName] = useState('Mostrador')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash')
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastOrderNumber, setLastOrderNumber] = useState<number | null>(null)

  const { items, addItem, updateQuantity, removeItem, totalCents, totalItems, clearCart } = useCart()

  const categories = useMemo(() => {
    const cats = Array.from(new Set(DEMO_PRODUCTS.map(p => p.category)))
    return ['all', ...cats]
  }, [])

  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter(p => {
      const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase())
      const matchesCat = activeCategory === 'all' || p.category === activeCategory
      return matchesQuery && matchesCat
    })
  }, [query, activeCategory])

  const handleCreateOrder = () => {
    if (items.length === 0) {
      alert('Agrega productos al carrito')
      return
    }
    if (!customerName.trim()) {
      alert('Ingresa nombre del cliente')
      return
    }

    const input: CreateOrderInput = {
      source: 'counter',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        variantId: item.variantId,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        customizations: item.customizations,
      })),
      paymentMethod,
      paymentStatus: 'pending'
    }

    const order = createOrder(input)
    setLastOrderNumber(order.orderNumber)
    setShowSuccess(true)
    clearCart()
    
    setTimeout(() => setShowSuccess(false), 4000)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">POS Mostrador</h1>
          <div className="text-sm text-gray-600">PB-04 / PB-09</div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat === 'all' ? 'Todo' : cat}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-red-600">{formatMoney(product.basePriceCents)}</span>
                    <button
                      onClick={() => addItem({
                        productId: product.id,
                        name: product.name,
                        unitPriceCents: product.basePriceCents,
                        quantity: 1
                      })}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
              <h2 className="font-bold text-lg mb-4">Carrito ({totalItems})</h2>
              
              {items.length === 0 ? (
                <p className="text-gray-500 text-sm">Sin productos</p>
              ) : (
                <>
                  <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          {item.variantName && <div className="text-xs text-gray-500">{item.variantName}</div>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 border rounded">-</button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 border rounded">+</button>
                          <button onClick={() => removeItem(item.id)} className="text-red-600 ml-2">×</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Cliente</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Teléfono (opcional)</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Pago</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'transfer')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="cash">Efectivo</option>
                        <option value="card">Tarjeta</option>
                        <option value="transfer">Transferencia</option>
                      </select>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-red-600">{formatMoney(totalCents)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCreateOrder}
                      className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                    >
                      Crear pedido
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="text-5xl mb-4">🍕</div>
            <h3 className="text-2xl font-bold mb-2">¡Pedido creado!</h3>
            <p className="text-gray-600 mb-4">Folio #{lastOrderNumber}</p>
            <p className="text-sm text-gray-500 mb-6">El pedido se envió a cocina</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
