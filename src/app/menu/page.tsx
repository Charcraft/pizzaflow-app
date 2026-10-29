import { ProductCard } from '@/components/ProductCard'

// Mock data - will be replaced with Supabase query
const mockProducts = [
  {
    id: '1',
    name: 'Pizza Margarita',
    description: 'Salsa de tomate, mozzarella fresca y albahaca',
    base_price_cents: 8500,
    image_url: null,
    category: 'pizza'
  },
  {
    id: '2',
    name: 'Pizza Pepperoni',
    description: 'Salsa de tomate, mozzarella y pepperoni',
    base_price_cents: 9500,
    image_url: null,
    category: 'pizza'
  },
  {
    id: '3',
    name: 'Pizza Hawaiana',
    description: 'Salsa de tomate, mozzarella, jamón y piña',
    base_price_cents: 9500,
    image_url: null,
    category: 'pizza'
  },
  {
    id: '4',
    name: 'Pizza Cuatro Quesos',
    description: 'Mozzarella, parmesano, gorgonzola y provolone',
    base_price_cents: 10500,
    image_url: null,
    category: 'pizza'
  },
  {
    id: '5',
    name: 'Refresco 600ml',
    description: 'Coca Cola, Sprite o Fanta',
    base_price_cents: 2500,
    image_url: null,
    category: 'bebida'
  },
  {
    id: '6',
    name: 'Agua 500ml',
    description: 'Agua mineral',
    base_price_cents: 1500,
    image_url: null,
    category: 'bebida'
  }
]

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nuestro Menú</h1>
          <p className="text-gray-600 mt-2">Pizzas artesanales y bebidas refrescantes</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              basePriceCents={product.base_price_cents}
              imageUrl={product.image_url}
              category={product.category}
            />
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Nota de desarrollo</h3>
          <p className="text-sm text-blue-800">
            Esta vista usa datos mock. Conectar a Supabase en el próximo paso.
            Las variantes (tamaños) y personalización se implementarán en PB-02.
          </p>
        </div>
      </div>
    </main>
  )
}