// Types for PizzaFlow Supabase DB
// TODO: Generate with `supabase gen types typescript --linked > src/types/database.ts`

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          phone: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          phone?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          role?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          base_price_cents: number
          image_url: string | null
          category: string
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          base_price_cents: number
          image_url?: string | null
          category: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          base_price_cents?: number
          image_url?: string | null
          category?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: number
          source: string
          status: string
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          pickup_time: string | null
          subtotal_cents: number
          discount_cents: number
          total_cents: number
          payment_method: string | null
          payment_status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: number
          source: string
          status?: string
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          pickup_time?: string | null
          subtotal_cents: number
          discount_cents?: number
          total_cents: number
          payment_method?: string | null
          payment_status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: number
          source?: string
          status?: string
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          pickup_time?: string | null
          subtotal_cents?: number
          discount_cents?: number
          total_cents?: number
          payment_method?: string | null
          payment_status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          quantity: number
          unit_price_cents: number
          total_price_cents: number
          customizations: Json
          notes: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          variant_id?: string | null
          quantity?: number
          unit_price_cents: number
          total_price_cents: number
          customizations?: Json
          notes?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          variant_id?: string | null
          quantity?: number
          unit_price_cents?: number
          total_price_cents?: number
          customizations?: Json
          notes?: string | null
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}