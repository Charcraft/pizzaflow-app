'use client'

import { useSyncExternalStore } from 'react'
import {
  getServerSession,
  getSession,
  subscribeSession,
} from '@/lib/auth/store'

export function useSession() {
  return useSyncExternalStore(subscribeSession, getSession, getServerSession)
}
