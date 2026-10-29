export default function MostradorPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🖥️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Módulo Mostrador</h1>
          <p className="text-gray-600 mb-6">
            Sistema POS para pedidos en mostrador
          </p>
          <div className="text-left space-y-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
            <p><strong>Próximas funcionalidades:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Nuevo pedido con búsqueda de productos</li>
              <li>Selección de variantes (tamaño)</li>
              <li>Personalización de ingredientes</li>
              <li>Cobro y generación de ticket</li>
              <li>Integración con KDS cocina en tiempo real</li>
            </ul>
          </div>
          <div className="mt-6 text-xs text-gray-500">
            Estado: ✅ Estructura creada • ⏳ Desarrollo pendiente (PB-04, PB-09)
          </div>
        </div>
      </div>
    </main>
  )
}