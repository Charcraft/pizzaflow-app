'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  description: string | null
  basePriceCents: number
  imageUrl: string | null
  category: string
}

export function ProductCard({ id, name, description, basePriceCents, imageUrl, category }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  
  const price = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(basePriceCents / 100)

  const handleAdd = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gradient-to-br from-orange-50 to-red-50 relative">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🍕</span>
          </div>
        )}
        <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur rounded-full capitalize">
          {category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-red-600">{price}</span>
          <button
            onClick={handleAdd}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              added
                ? 'bg-green-100 text-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {added ? '✓ Agregado' : '+ Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}