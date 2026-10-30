const SESSION_KEY = 'pizzaflow-session'
const CUSTOMERS_KEY = 'pizzaflow-customers'
const SESSION_EVENT = 'pizzaflow:session'

export type Role = 'admin' | 'staff' | 'customer'

export interface Session {
  email: string
  name: string
  phone: string
  role: Role
  loggedAt: string
}

interface Account {
  email: string
  passwordHash: string
  name: string
  phone: string
  role: Role
  createdAt: string
}

const ADMIN_ACCOUNT: Account = {
  email: 'pinedadeidad@67.com',
  passwordHash: '784c49279282513213ff82f9e17822541d75c3302cd7d5a91774df9759b29c64',
  name: 'Leito',
  phone: '',
  role: 'admin',
  createdAt: '2026-10-30T00:00:00.000Z',
}

let cache: Session | null | undefined
const listeners = new Set<() => void>()

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function readSession(): Session | null {
  if (!hasStorage()) return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!parsed?.email || !parsed?.role) return null
    return {
      email: parsed.email,
      name: parsed.name ?? '',
      phone: parsed.phone ?? '',
      role: parsed.role,
      loggedAt: parsed.loggedAt ?? new Date().toISOString(),
    }
  } catch {
    return null
  }
}

function readCustomers(): Account[] {
  if (!hasStorage()) return []
  try {
    const raw = window.localStorage.getItem(CUSTOMERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is Account =>
        !!item &&
        typeof item.email === 'string' &&
        typeof item.passwordHash === 'string' &&
        item.role === 'customer',
    )
  } catch {
    return []
  }
}

function writeCustomers(customers: Account[]): void {
  if (hasStorage()) {
    window.localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers))
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

function findAccount(email: string): Account | undefined {
  const normalized = normalizeEmail(email)
  if (normalized === ADMIN_ACCOUNT.email) return ADMIN_ACCOUNT
  return readCustomers().find((account) => account.email === normalized)
}

export async function login(
  email: string,
  password: string,
): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  const account = findAccount(email)
  if (!account) {
    return { ok: false, error: 'Correo o contraseña incorrectos.' }
  }

  const hash = await sha256(password)
  if (hash !== account.passwordHash) {
    return { ok: false, error: 'Correo o contraseña incorrectos.' }
  }

  const session: Session = {
    email: account.email,
    name: account.name,
    phone: account.phone,
    role: account.role,
    loggedAt: new Date().toISOString(),
  }
  persist(session)
  return { ok: true, session }
}

export async function loginStaff(
  email: string,
  password: string,
): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  const result = await login(email, password)
  if (!result.ok) return result
  if (result.session.role === 'customer') {
    persist(null)
    return { ok: false, error: 'Esta cuenta es de cliente. Usa el acceso de clientes.' }
  }
  return result
}

export interface RegisterInput {
  name: string
  email: string
  phone: string
  password: string
}

export async function register(
  input: RegisterInput,
): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  const name = input.name.trim()
  const email = normalizeEmail(input.email)
  const phone = input.phone.trim()
  const password = input.password

  if (name.length < 2) {
    return { ok: false, error: 'Escribe tu nombre completo.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Escribe un correo válido.' }
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return { ok: false, error: 'Escribe un teléfono de 10 dígitos.' }
  }
  if (password.length < 6) {
    return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' }
  }
  if (findAccount(email)) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo.' }
  }

  const account: Account = {
    email,
    passwordHash: await sha256(password),
    name,
    phone,
    role: 'customer',
    createdAt: new Date().toISOString(),
  }

  writeCustomers([...readCustomers(), account])
  const session: Session = {
    email: account.email,
    name: account.name,
    phone: account.phone,
    role: account.role,
    loggedAt: new Date().toISOString(),
  }
  persist(session)
  return { ok: true, session }
}

export function logout(): void {
  persist(null)
}
