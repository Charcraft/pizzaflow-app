export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Dueño</h1>
          <p className="text-gray-600">Métricas y control del negocio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Ventas hoy', value: '$0', change: '—' },
            { label: 'Pedidos hoy', value: '0', change: '—' },
            { label: 'Ticket promedio', value: '$0', change: '—' },
            { label: 'Tiempo promedio', value: '0 min', change: '—' }
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600">{card.label}</div>
              <div className="text-2xl font-bold mt-1">{card.value}</div>
              <div className="text-xs text-gray-500 mt-1">{card.change}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">Ventas por día</h3>
            <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
              Gráfico de ventas (Plausible + Supabase)
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">Top productos</h3>
            <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
              Top 5 productos vendidos
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          Estado: ✅ Estructura creada • ⏳ Desarrollo pendiente (PB-08, PB-16)
        </div>
      </div>
    </main>
  )
}