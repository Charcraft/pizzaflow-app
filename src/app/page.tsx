import Link from 'next/link'

const MODULES = [
  {
    title: 'Pedir en línea',
    description: 'Explora el menú, personaliza tu pizza y recoge en mostrador.',
    href: '/menu',
    icon: '🍕',
    cta: 'Ver menú',
  },
  {
    title: 'Mostrador',
    description: 'Punto de venta para pedidos en local con folio y cobro.',
    href: '/mostrador',
    icon: '🖥️',
    cta: 'Abrir POS',
  },
  {
    title: 'Cocina',
    description: 'Comandas en tiempo real, semáforo de espera y cronómetro de horno.',
    href: '/cocina',
    icon: '👨‍🍳',
    cta: 'Ver KDS',
  },
  {
    title: 'Dashboard',
    description: 'Ventas, ticket promedio, tiempos y productos más vendidos.',
    href: '/dashboard',
    icon: '📊',
    cta: 'Ver métricas',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-100">
      <header className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-red-700">
          🍕 PizzaFlow
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/menu" className="text-gray-700 hover:text-red-700">
            Menú
          </Link>
          <Link href="/mostrador" className="text-gray-700 hover:text-red-700">
            Mostrador
          </Link>
          <Link href="/cocina" className="text-gray-700 hover:text-red-700">
            Cocina
          </Link>
          <Link
            href="/menu"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Pedir ahora
          </Link>
        </nav>
      </header>

      <section className="max-w-5xl mx-auto px-4 pt-12 pb-16 text-center">
        <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-red-200 text-sm text-red-700">
          Recoge en mostrador · 15-25 min
        </p>
        <h1 className="mt-6 text-4xl sm:text-6xl font-bold text-gray-900 leading-tight">
          Tu pizza, sin filas
          <span className="block text-red-600">y sin perder comandas</span>
        </h1>
        <p className="mt-5 text-lg text-gray-700 max-w-2xl mx-auto">
          Pide desde el celular, personaliza tu pizza y sigue el estado en tiempo real.
          Cocina recibe cada comanda en una sola pantalla.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/menu"
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
          >
            Pedir ahora
          </Link>
          <Link
            href="/mostrador"
            className="px-6 py-3 bg-white text-red-700 rounded-xl font-semibold border border-red-200 hover:bg-red-50"
          >
            Soy del mostrador
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODULES.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="text-4xl">{module.icon}</div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">{module.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{module.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-red-600 group-hover:underline">
                {module.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-red-100 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-gray-500">
          Grupo 4-C · UPChiapas · Análisis y Diseño de Software · 2026
        </div>
      </footer>
    </main>
  )
}
