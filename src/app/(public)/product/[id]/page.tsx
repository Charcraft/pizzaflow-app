import { notFound } from 'next/navigation'
import { getDemoProduct } from '@/lib/menu/products'
import { ProductCustomizer } from './ProductCustomizer'

export const instant = false

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = getDemoProduct(id)

  if (!product) notFound()

  return <ProductCustomizer product={product} />
}
