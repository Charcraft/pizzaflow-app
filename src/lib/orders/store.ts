import type {
  CreateOrderInput,
  Order,
  OrderItem,
  OrderMetrics,
  OrderStatus,
} from './types'
import { ACTIVE_STATUSES } from './types'

const STORAGE_KEY = 'pizzaflow-orders-v1'
const ORDERS_EVENT = 'pizzaflow:orders'

const EMPTY_ORDERS: Order[] = []
let cache: Order[] | null = null
const listeners = new Set<() => void>()

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function nowIso(): string {
  return new Date().toISOString()
}

function minutesAgoIso(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `order-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function buildItem(item: CreateOrderInput['items'][number]): OrderItem {
  return {
    ...item,
    id: createId(),
    totalPriceCents: item.unitPriceCents * item.quantity,
  }
}

function normalizeOrder(order: Order): Order {
  return {
    ...order,
    tableNumber: order.tableNumber ?? null,
    customerPhone: order.customerPhone ?? '',
    notes: order.notes ?? '',
    discountCents: order.discountCents ?? 0,
    ovenStartedAt: order.ovenStartedAt ?? null,
    ovenEndedAt: order.ovenEndedAt ?? null,
    readyAt: order.readyAt ?? null,
  }
}

function demoOrders(): Order[] {
  const demos: Array<{
    number: number
    source: Order['source']
    status: OrderStatus
    customer: string
    minutes: number
    items: Array<{ name: string; qty: number; price: number }>
  }> = [
    {
      number: 1001,
      source: 'web',
      status: 'pending',
      customer: 'María López',
      minutes: 0.4,
      items: [
        { name: 'Pizza Margarita', qty: 1, price: 11500 },
        { name: 'Refresco 600ml', qty: 2, price: 2500 },
      ],
    },
    {
      number: 1002,
      source: 'counter',
      status: 'preparing',
      customer: 'Mostrador · Mesa 2',
      minutes: 1.6,
      items: [
        { name: 'Pizza Pepperoni', qty: 1, price: 12500 },
        { name: 'Alitas 6 piezas', qty: 1, price: 7500 },
      ],
    },
    {
      number: 1003,
      source: 'qr_table',
      status: 'in_oven',
      customer: 'Mesa 4 · Carlos',
      minutes: 3.2,
      items: [{ name: 'Pizza Cuatro Quesos', qty: 1, price: 16500 }],
    },
  ]

  return demos.map((demo) => {
    const createdAt = minutesAgoIso(demo.minutes)
    const items = demo.items.map((item) => ({
      id: createId(),
      productId: item.name.toLowerCase().replace(/\s+/g, '-'),
      name: item.name,
      quantity: item.qty,
      unitPriceCents: item.price,
      totalPriceCents: item.price * item.qty,
    }))
    const subtotal = items.reduce((sum, item) => sum + item.totalPriceCents, 0)

    return {
      id: createId(),
      orderNumber: demo.number,
      source: demo.source,
      status: demo.status,
      customerName: demo.customer,
      customerPhone: '',
      tableNumber: demo.source === 'qr_table' ? 4 : null,
      items,
      subtotalCents: subtotal,
      discountCents: 0,
      totalCents: subtotal,
      paymentMethod: 'pending',
      paymentStatus: 'pending',
      notes: '',
      createdAt,
      updatedAt: createdAt,
      ovenStartedAt: demo.status === 'in_oven' ? minutesAgoIso(1.2) : null,
      ovenEndedAt: null,
      readyAt: null,
    }
  })
}

function readFromStorage(): Order[] {
  if (!hasStorage()) return EMPTY_ORDERS

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = demoOrders()
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return EMPTY_ORDERS
    return parsed.map((order) => normalizeOrder(order as Order))
  } catch {
    return EMPTY_ORDERS
  }
}

function notify(): void {
  for (const listener of listeners) listener()
}

function persist(orders: Order[]): void {
  cache = orders
  if (hasStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ORDERS_EVENT))
  }
  notify()
}

export function getOrders(): Order[] {
  if (cache === null) cache = readFromStorage()
  return cache
}

export function getServerSnapshot(): Order[] {
  return EMPTY_ORDERS
}

export function subscribe(listener: () => void): () => void {
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
    window.addEventListener(ORDERS_EVENT, onLocalChange)
  }

  return () => {
    listeners.delete(listener)
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(ORDERS_EVENT, onLocalChange)
    }
  }
}

export function createOrder(input: CreateOrderInput): Order {
  const orders = getOrders()
  const items = input.items.map(buildItem)
  const subtotalCents = items.reduce((sum, item) => sum + item.totalPriceCents, 0)
  const maxNumber = orders.reduce(
    (max, order) => Math.max(max, order.orderNumber),
    1000,
  )
  const timestamp = nowIso()

  const order: Order = {
    id: createId(),
    orderNumber: maxNumber + 1,
    source: input.source,
    status: 'pending',
    customerName: input.customerName.trim() || 'Cliente',
    customerPhone: input.customerPhone?.trim() ?? '',
    tableNumber: input.tableNumber ?? null,
    items,
    subtotalCents,
    discountCents: 0,
    totalCents: subtotalCents,
    paymentMethod: input.paymentMethod ?? 'pending',
    paymentStatus: input.paymentStatus ?? 'pending',
    notes: input.notes?.trim() ?? '',
    createdAt: timestamp,
    updatedAt: timestamp,
    ovenStartedAt: null,
    ovenEndedAt: null,
    readyAt: null,
  }

  persist([order, ...orders])
  return order
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const orders = getOrders()
  const existing = orders.find((order) => order.id === orderId)
  if (!existing) return null

  const timestamp = nowIso()
  const updated: Order = {
    ...existing,
    status,
    updatedAt: timestamp,
    ovenStartedAt:
      status === 'in_oven' ? existing.ovenStartedAt ?? timestamp : existing.ovenStartedAt,
    ovenEndedAt:
      status === 'ready' && existing.ovenStartedAt
        ? existing.ovenEndedAt ?? timestamp
        : existing.ovenEndedAt,
    readyAt: status === 'ready' ? existing.readyAt ?? timestamp : existing.readyAt,
  }

  persist(orders.map((order) => (order.id === orderId ? updated : order)))
  return updated
}

export function getOrderById(orderId: string): Order | null {
  return getOrders().find((order) => order.id === orderId) ?? null
}

export function getOrderByNumber(orderNumber: number): Order | null {
  return getOrders().find((order) => order.orderNumber === orderNumber) ?? null
}

export function getMetrics(orders: Order[] = getOrders()): OrderMetrics {
  const today = new Date()
  const isToday = (iso: string) => {
    const date = new Date(iso)
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  const todaysOrders = orders.filter((order) => isToday(order.createdAt))
  const billable = todaysOrders.filter((order) => order.status !== 'cancelled')
  const revenueCents = billable.reduce((sum, order) => sum + order.totalCents, 0)

  const prepTimes = todaysOrders
    .filter((order) => order.readyAt)
    .map(
      (order) =>
        (new Date(order.readyAt as string).getTime() -
          new Date(order.createdAt).getTime()) /
        60_000,
    )
  const averagePrepMinutes = prepTimes.length
    ? prepTimes.reduce((sum, value) => sum + value, 0) / prepTimes.length
    : null

  const byStatus = ACTIVE_STATUSES.reduce(
    (acc, status) => {
      acc[status] = todaysOrders.filter((order) => order.status === status).length
      return acc
    },
    {} as Record<OrderStatus, number>,
  )
  byStatus.completed = todaysOrders.filter((order) => order.status === 'completed').length
  byStatus.cancelled = todaysOrders.filter((order) => order.status === 'cancelled').length

  const productCount = new Map<string, number>()
  for (const order of billable) {
    for (const item of order.items) {
      productCount.set(item.name, (productCount.get(item.name) ?? 0) + item.quantity)
    }
  }
  const topProducts = [...productCount.entries()]
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  return {
    totalOrders: billable.length,
    revenueCents,
    averageTicketCents: billable.length ? Math.round(revenueCents / billable.length) : 0,
    averagePrepMinutes,
    byStatus,
    topProducts,
  }
}
