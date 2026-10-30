const SESSION_KEY = 'pizzaflow-session'
const SESSION_EVENT = 'pizzaflow:session'

export type Role = 'admin' | 'staff'

export interface Session {
  email: string
  name: string
  role: Role
  loggedAt: string
}

interface Account {
  email: string
  passwordHash: string
  name: string
  role: Role
}

const ACCOUNTS: Account[] = [
  {
    email: 'pinedadeidad@67.com',
    passwordHash: '784c49279282513213ff82f9e17822541d75c3302cd7d5a91774df9759b29c64',
    name: 'Leito',
    role: 'admin',
  },
]

let cache: Session | null | undefined
const listeners = new Set<() => void>()

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readSession(): Session | null {
  if (!hasStorage()) return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!parsed?.email || !parsed?.role) return null
    return parsed
  } catch {
    return null
  }
}

export function getSession(): Session | null {
  if (cache === undefined) cache = readSession()
  return cache
}

export function getServerSession(): null {
  return null
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === SESSION_KEY) {
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

function persist(session: Session | null): void {
  cache = session
  if (hasStorage()) {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } else {
      window.localStorage.removeItem(SESSION_KEY)
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SESSION_EVENT))
  }
  for (const listener of listeners) listener()
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function login(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalizedEmail = email.trim().toLowerCase()
  const account = ACCOUNTS.find((item) => item.email === normalizedEmail)

  if (!account) {
    return { ok: false, error: 'Correo o contraseña incorrectos.' }
  }

  const hash = await sha256(password)
  if (hash !== account.passwordHash) {
    return { ok: false, error: 'Correo o contraseña incorrectos.' }
  }

  persist({
    email: account.email,
    name: account.name,
    role: account.role,
    loggedAt: new Date().toISOString(),
  })
  return { ok: true }
}

export function logout(): void {
  persist(null)
}
