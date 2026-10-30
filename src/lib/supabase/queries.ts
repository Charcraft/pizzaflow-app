import { createClient } from './client'
import type { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row'] & {
  variants?: Database['public']['Tables']['product_variants']['Row'][]
}

export async function getProducts() {
  const supabase = createClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*)
    `)
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (products || []) as Product[]
}

export async function getProductById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as Product
}
