import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'
import { DEMO_PRODUCTS } from '@/lib/menu/products'

export const metadata = {
  title: 'Menú - PizzaFlow',
  description: 'Pizzas artesanales, bebidas y extras',
}

const SECTIONS: Array<{ key: 'pizza' | 'bebida' | 'extra'; title: string }> = [
  { key: 'pizza', title: 'Pizzas' },
  { key: 'bebida', title: 'Bebidas' },
  { key: 'extra', title: 'Extras' },
]

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div className="min-w-0">
            <Link href="/" className="text-sm text-red-600 hover:underline">
              ← Inicio
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Nuestro Menú</h1>
            <p className="text-gray-600 mt-2">
              Pizzas artesanales, bebidas y extras. Recoge en mostrador en 15-25 min.
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full sm:w-auto shrink-0"
          >
            Ver carrito
          </Link>
        </div>

        {SECTIONS.map((section) => {
          const products = DEMO_PRODUCTS.filter((product) => product.category === section.key)
          if (products.length === 0) return null
          return (
            <section key={section.key} className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )
        })}

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Personaliza tu pizza</h3>
          <p className="text-sm text-blue-800">
            Elige tamaño, extras y mitad/mitad desde el detalle de cada pizza. El precio se
            recalcula en tiempo real.
          </p>
        </div>
      </div>
    </main>
  )
}
