'use client'

import { useSyncExternalStore } from 'react'
import { getOrders, getServerSnapshot, subscribe } from '@/lib/orders/store'

export function useOrders() {
  return useSyncExternalStore(subscribe, getOrders, getServerSnapshot)
}
