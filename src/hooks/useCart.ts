'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { OrderItemCustomization } from '@/lib/orders/types'

export interface CartItem {
  id: string
  productId: string
  name: string
  variantId?: string
  variantName?: string
  quantity: number
  unitPriceCents: number
  customizations?: OrderItemCustomization[]
}

const STORAGE_KEY = 'pizzaflow-cart'
const CART_EVENT = 'pizzaflow:cart'
const EMPTY_CART: CartItem[] = []

let cache: CartItem[] | null = null
const listeners = new Set<() => void>()

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readCart(): CartItem[] {
  if (!hasStorage()) return EMPTY_CART
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_CART
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : EMPTY_CART
  } catch {
    return EMPTY_CART
  }
}

function getSnapshot(): CartItem[] {
  if (cache === null) cache = readCart()
  return cache
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null
      listener()
    }
  }
  const onLocalChange = () => listener()

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage)
    window.addEventListener(CART_EVENT, onLocalChange)
  }

  return () => {
    listeners.delete(listener)
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(CART_EVENT, onLocalChange)
    }
  }
}

function persist(next: CartItem[]): void {
  cache = next
  if (hasStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CART_EVENT))
  }
  for (const listener of listeners) listener()
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const addItem = useCallback(
    (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
      const current = getSnapshot()
      const existing = current.find(
        (entry) => entry.productId === item.productId && entry.variantId === item.variantId,
      )

      if (existing) {
        persist(
          current.map((entry) =>
            entry.id === existing.id
              ? { ...entry, quantity: entry.quantity + (item.quantity ?? 1) }
              : entry,
          ),
        )
        return
      }

      persist([
        ...current,
        {
          ...item,
          quantity: item.quantity ?? 1,
          id: crypto.randomUUID(),
        },
      ])
    },
    [],
  )

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const current = getSnapshot()
    if (quantity <= 0) {
      persist(current.filter((item) => item.id !== id))
      return
    }
    persist(current.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }, [])

  const removeItem = useCallback((id: string) => {
    persist(getSnapshot().filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    persist([])
  }, [])

  const totalCents = items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  )
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalCents,
    totalItems,
    isHydrated: true,
  }
}
