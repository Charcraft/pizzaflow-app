'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { getPromotion, normalizePromoCode } from '@/lib/promotions'

const STORAGE_KEY = 'pizzaflow-promo'
const PROMO_EVENT = 'pizzaflow:promo'

let cache: string | null | undefined
const listeners = new Set<() => void>()

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readPromo(): string | null {
  if (!hasStorage()) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? normalizePromoCode(raw) : null
  } catch {
    return null
  }
}

function getSnapshot(): string | null {
  if (cache === undefined) cache = readPromo()
  return cache
}

function getServerSnapshot(): null {
  return null
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = undefined
      listener()
    }
  }
  if (typeof window !== 'undefined') window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage)
  }
}

function persist(code: string | null): void {
  cache = code
  if (hasStorage()) {
    if (code) window.localStorage.setItem(STORAGE_KEY, code)
    else window.localStorage.removeItem(STORAGE_KEY)
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(PROMO_EVENT))
  for (const listener of listeners) listener()
}

export function usePromo() {
  const code = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const applyCode = useCallback((input: string): boolean => {
    const normalized = normalizePromoCode(input)
    if (!getPromotion(normalized)) return false
    persist(normalized)
    return true
  }, [])

  const clearPromo = useCallback(() => persist(null), [])

  return { code, applyCode, clearPromo }
}
