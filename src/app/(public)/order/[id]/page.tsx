import { OrderTrackingClient } from './OrderTrackingClient'

export const instant = false

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <OrderTrackingClient orderId={id} />
}
