import { notFound } from 'next/navigation'
import Link from 'next/link'

// Mock product data with customization
const mockProduct = {
  id: '1',
  name: 'Pizza Margarita',
  description: 'Salsa de tomate, mozzarella fresca y albahaca',
  base_price_cents: 8500,
  variants: [
    { id: 'v1', name: 'Pequeña', price_modifier_cents: -2000 },
    { id: 'v2', name: 'Mediana', price_modifier_cents: 0 },
    { id: 'v3', name: 'Grande', price_modifier_cents: 3000 },
    { id: 'v4', name: 'Familiar', price_modifier_cents: 6000 },
  ],
  ingredients: [
    { id: '1', name: 'Champiñones', price_cents: 500, available: true },
    { id: '2', name: 'Aceitunas', price_cents: 400, available: true },
    { id: '3', name: 'Pimiento', price_cents: 300, available: true },
    { id: '4', name: 'Cebolla caramelizada', price_cents: 400, available: false },
  ]
}

export default function ProductPage({ params }: { params: { id: string } }) {
  if (params.id !== '1') return notFound()

  const product = mockProduct
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/menu" className="text-red-600 hover:underline mb-4 inline-block">
          ← Volver al menú
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Tamaño</h3>
              <div className="space-y-2">
                {product.variants.map(v => {
                  const price = product.base_price_cents + v.price_modifier_cents
                  return (
                    <label key={v.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <span>{v.name}</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price / 100)}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Personalización</h3>
              <div className="space-y-2">
                {product.ingredients.map(ing => (
                  <label key={ing.id} className={`flex items-center justify-between p-3 border rounded-lg ${!ing.available ? 'opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}>
                    <span>{ing.name} {ing.available ? '' : '(Agotado)'}</span>
                    <span>+{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(ing.price_cents / 100)}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <strong>Mitad/Mitad:</strong> Puedes elegir 2 sabores diferentes (PB-02)
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="text-lg">Precio total estimado</span>
            <span className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.base_price_cents / 100)}
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
