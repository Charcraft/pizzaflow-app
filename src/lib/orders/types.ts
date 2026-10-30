export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'in_oven'
  | 'ready'
  | 'completed'
  | 'cancelled'

export type OrderSource = 'web' | 'counter' | 'phone' | 'qr_table'

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'pending'

export type PaymentStatus = 'pending' | 'paid' | 'refunded'

export interface OrderItemCustomization {
  name: string
  priceCents: number
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  variantId?: string
  variantName?: string
  quantity: number
  unitPriceCents: number
  totalPriceCents: number
  notes?: string
  customizations?: OrderItemCustomization[]
}

export interface Order {
  id: string
  orderNumber: number
  source: OrderSource
  status: OrderStatus
  customerName: string
  customerPhone: string
  tableNumber: number | null
  items: OrderItem[]
  subtotalCents: number
  discountCents: number
  totalCents: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  notes: string
  createdAt: string
  updatedAt: string
  ovenStartedAt: string | null
  ovenEndedAt: string | null
  readyAt: string | null
  isDemo?: boolean
}

export type CreateOrderItemInput = Omit<OrderItem, 'id' | 'totalPriceCents'>

export interface CreateOrderInput {
  source: OrderSource
  customerName: string
  customerPhone?: string
  tableNumber?: number | null
  items: CreateOrderItemInput[]
  paymentMethod?: PaymentMethod
  paymentStatus?: PaymentStatus
  notes?: string
}

export interface OrderMetrics {
  totalOrders: number
  revenueCents: number
  averageTicketCents: number
  averagePrepMinutes: number | null
  byStatus: Record<OrderStatus, number>
  topProducts: Array<{ name: string; quantity: number }>
}

export const ACTIVE_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'in_oven',
  'ready',
]

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Nuevo',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  in_oven: 'En horno',
  ready: 'Listo',
  completed: 'Entregado',
  cancelled: 'Cancelado',
}

export const SOURCE_LABELS: Record<OrderSource, string> = {
  web: 'Web',
  counter: 'Mostrador',
  phone: 'Teléfono',
  qr_table: 'QR Mesa',
}
