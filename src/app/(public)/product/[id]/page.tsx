import { notFound } from 'next/navigation'
import { getDemoProduct } from '@/lib/menu/products'
import { ProductCustomizer } from './ProductCustomizer'
import type { Metadata } from 'next'

export const instant = false

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = getDemoProduct(id)
  if (!product) return { title: 'Producto no encontrado' }
  return {
    title: `${product.name} — personaliza tu pizza`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
    },
  }
}

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
