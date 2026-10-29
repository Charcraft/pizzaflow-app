export default function CocinaPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-5xl">👨‍🍳</div>
            <div>
              <h1 className="text-3xl font-bold text-white">KDS COCINA</h1>
              <p className="text-gray-400">Kitchen Display System</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-red-600/20 border border-red-500/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-400">0</div>
              <div className="text-sm text-gray-400">Nuevos</div>
            </div>
            <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-400">0</div>
              <div className="text-sm text-gray-400">Preparando</div>
            </div>
            <div className="bg-green-600/20 border border-green-500/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">0</div>
              <div className="text-sm text-gray-400">Listos</div>
            </div>
          </div>

          <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-500 mb-2">Sin pedidos pendientes</p>
            <p className="text-xs text-gray-600">
              Estado: ✅ Estructura creada • ⏳ Desarrollo pendiente (PB-05, PB-06)
            </p>
          </div>

          <div className="mt-6 text-xs text-gray-500 text-center">
            Realtime Supabase conectado • FIFO • Semáforo de espera • Cronómetro horno
          </div>
        </div>
      </div>
    </main>
  )
}