import { formatMoney } from '@/lib/menu/products'
import { SOURCE_LABELS, type Order } from './types'

export const OWNER_WHATSAPP = '529611900363'

export function buildOrderMessage(order: Order): string {
  const lines: string[] = []
  lines.push(`🍕 NUEVO PEDIDO #${order.orderNumber}`)
  lines.push(`Canal: ${SOURCE_LABELS[order.source]}`)
  lines.push(`Cliente: ${order.customerName}`)
  if (order.customerPhone) lines.push(`Teléfono: ${order.customerPhone}`)
  if (order.tableNumber) lines.push(`Mesa: ${order.tableNumber}`)
  lines.push(
    `Hora: ${new Date(order.createdAt).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })}`,
  )
  lines.push('—')
  for (const item of order.items) {
    const variant = item.variantName ? ` (${item.variantName})` : ''
    lines.push(`${item.quantity}x ${item.name}${variant} — ${formatMoney(item.totalPriceCents)}`)
    if (item.customizations && item.customizations.length > 0) {
      lines.push(`   + ${item.customizations.map((extra) => extra.name).join(', ')}`)
    }
  }
  lines.push('—')
  lines.push(`Subtotal: ${formatMoney(order.subtotalCents)}`)
  if (order.discountCents > 0) {
    lines.push(
      `Descuento${order.promoCode ? ` (${order.promoCode})` : ''}: -${formatMoney(order.discountCents)}`,
    )
  }
  lines.push(`TOTAL: ${formatMoney(order.totalCents)}`)
  lines.push(
    `Pago: ${
      order.paymentMethod === 'cash'
        ? 'Efectivo'
        : order.paymentMethod === 'card'
          ? 'Tarjeta'
          : order.paymentMethod === 'transfer'
            ? 'Transferencia'
            : 'Pendiente'
    } (${order.paymentStatus === 'paid' ? 'pagado' : 'pendiente'})`,
  )
  if (order.notes) lines.push(`Notas: ${order.notes}`)
  lines.push('')
  lines.push('Enviado desde PizzaFlow')
  return lines.join('\n')
}

export function buildOrderWhatsAppUrl(order: Order): string {
  return `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(buildOrderMessage(order))}`
}
