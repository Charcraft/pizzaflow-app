export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-red-600">🍕 PizzaFlow</h1>
        <p className="text-xl text-gray-700 max-w-md">
          Sistema integral para pizzería pequeña
          <br />
          <span className="text-sm text-gray-500">Landing, Mostrador, Cocina, Dashboard</span>
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/menu" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Ver Menú
          </a>
          <a href="/mostrador" className="px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition">
            Mostrador
          </a>
        </div>
        <div className="pt-8 text-xs text-gray-500">
          Grupo 4-C • UPChiapas • Análisis y Diseño de Software • 2026
        </div>
      </div>
    </main>
  )
}