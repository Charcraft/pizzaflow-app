'use client'

import { useState, useEffect, useCallback } from 'react'

export interface CartItem {
  id: string
  productId: string
  name: string
  variantId?: string
  variantName?: string
  quantity: number
  unitPriceCents: number
  customizations?: Record<string, unknown>
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('pizzaflow-cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {}
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('pizzaflow-cart', JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.variantId === item.variantId)
      if (existing) {
        return prev.map(i => 
          i.id === existing.id 
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      }
      return [...prev, { ...item, quantity: item.quantity || 1, id: crypto.randomUUID() }]
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== id))
      return
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalCents = items.reduce((sum, item) => sum + (item.unitPriceCents * item.quantity), 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalCents,
    totalItems,
    isHydrated
  }
}