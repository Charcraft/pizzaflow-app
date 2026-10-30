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
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: { id?: string; name: string; description?: string | null; created_at?: string }
        Update: { id?: string; name?: string; description?: string | null; created_at?: string }
      }
      profiles: {
        Row: {
          id: string
          phone: string | null
          role: string | null
          is_active: boolean
          last_login: string | null
          created_at: string
        }
        Insert: {
          id: string
          phone?: string | null
          role?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          role?: string | null
          is_active?: boolean
          last_login?: string | null
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
          table_number: number | null
          pickup_time: string | null
          delivery_address: string | null
          assigned_to: string | null
          subtotal_cents: number
          discount_cents: number
          total_cents: number
          payment_method: string | null
          payment_status: string
          oven_start_time: string | null
          oven_end_time: string | null
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
          table_number?: number | null
          pickup_time?: string | null
          delivery_address?: string | null
          assigned_to?: string | null
          subtotal_cents: number
          discount_cents?: number
          total_cents: number
          payment_method?: string | null
          payment_status?: string
          oven_start_time?: string | null
          oven_end_time?: string | null
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
          table_number?: number | null
          pickup_time?: string | null
          delivery_address?: string | null
          assigned_to?: string | null
          subtotal_cents?: number
          discount_cents?: number
          total_cents?: number
          payment_method?: string | null
          payment_status?: string
          oven_start_time?: string | null
          oven_end_time?: string | null
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
      product_variants: {
        Row: { id: string; product_id: string; name: string; price_modifier_cents: number; sort_order: number }
        Insert: { id?: string; product_id: string; name: string; price_modifier_cents?: number; sort_order?: number }
        Update: { id?: string; product_id?: string; name?: string; price_modifier_cents?: number; sort_order?: number }
      }
      ingredients: {
        Row: { id: string; name: string; price_cents: number; is_vegetarian: boolean; is_vegan: boolean; allergen_info: string | null }
        Insert: { id?: string; name: string; price_cents?: number; is_vegetarian?: boolean; is_vegan?: boolean; allergen_info?: string | null }
        Update: { id?: string; name?: string; price_cents?: number; is_vegetarian?: boolean; is_vegan?: boolean; allergen_info?: string | null }
      }
      promotions: {
        Row: { id: string; code: string; name: string; description: string | null; type: string; value: number; min_order_cents: number; max_uses: number | null; used_count: number; starts_at: string | null; ends_at: string | null; is_active: boolean }
        Insert: { id?: string; code: string; name: string; description?: string | null; type: string; value: number; min_order_cents?: number; max_uses?: number | null; used_count?: number; starts_at?: string | null; ends_at?: string | null; is_active?: boolean }
        Update: { id?: string; code?: string; name?: string; description?: string | null; type?: string; value?: number; min_order_cents?: number; max_uses?: number | null; used_count?: number; starts_at?: string | null; ends_at?: string | null; is_active?: boolean }
      }
      analytics_events: {
        Row: { id: string; event_name: string; session_id: string | null; user_id: string | null; properties: Json; page_url: string | null; created_at: string }
        Insert: { id?: string; event_name: string; session_id?: string | null; user_id?: string | null; properties?: Json; page_url?: string | null; created_at?: string }
        Update: { id?: string; event_name?: string; session_id?: string | null; user_id?: string | null; properties?: Json; page_url?: string | null; created_at?: string }
      }
      user_feedback: {
        Row: { id: string; session_id: string | null; user_id: string | null; rating: number | null; reason: string | null; comment: string | null; created_at: string }
        Insert: { id?: string; session_id?: string | null; user_id?: string | null; rating?: number | null; reason?: string | null; comment?: string | null; created_at?: string }
        Update: { id?: string; session_id?: string | null; user_id?: string | null; rating?: number | null; reason?: string | null; comment?: string | null; created_at?: string }
      }
      tables: {
        Row: { id: string; number: number; name: string | null; capacity: number; is_active: boolean }
        Insert: { id?: string; number: number; name?: string | null; capacity?: number; is_active?: boolean }
        Update: { id?: string; number?: number; name?: string | null; capacity?: number; is_active?: boolean }
      }
      recipes: {
        Row: { id: string; product_id: string; name: string; is_active: boolean; created_at: string }
        Insert: { id?: string; product_id: string; name: string; is_active?: boolean; created_at?: string }
        Update: { id?: string; product_id?: string; name?: string; is_active?: boolean; created_at?: string }
      }
      recipe_ingredients: {
        Row: { id: string; recipe_id: string; ingredient_id: string | null; quantity: number; unit: string | null; created_at: string }
        Insert: { id?: string; recipe_id: string; ingredient_id?: string | null; quantity?: number; unit?: string | null; created_at?: string }
        Update: { id?: string; recipe_id?: string; ingredient_id?: string | null; quantity?: number; unit?: string | null; created_at?: string }
      }
      inventory: {
        Row: { id: string; ingredient_id: string; quantity: number; min_quantity: number; unit: string | null; last_restock: string | null; updated_at: string }
        Insert: { id?: string; ingredient_id: string; quantity: number; min_quantity?: number; unit?: string | null; last_restock?: string | null; updated_at?: string }
        Update: { id?: string; ingredient_id?: string; quantity?: number; min_quantity?: number; unit?: string | null; last_restock?: string | null; updated_at?: string }
      }
      order_splits: {
        Row: { id: string; order_id: string; split_type: string; total_splits: number; paid_splits: number; created_at: string }
        Insert: { id?: string; order_id: string; split_type: string; total_splits?: number; paid_splits?: number; created_at?: string }
        Update: { id?: string; order_id?: string; split_type?: string; total_splits?: number; paid_splits?: number; created_at?: string }
      }
      split_items: {
        Row: { id: string; split_id: string; order_item_id: string | null; assigned_to: string | null; amount_cents: number; paid: boolean; paid_at: string | null }
        Insert: { id?: string; split_id: string; order_item_id?: string | null; assigned_to?: string | null; amount_cents: number; paid?: boolean; paid_at?: string | null }
        Update: { id?: string; split_id?: string; order_item_id?: string | null; assigned_to?: string | null; amount_cents?: number; paid?: boolean; paid_at?: string | null }
      }
      delivery_routes: {
        Row: { id: string; driver_id: string | null; order_id: string | null; estimated_time_min: number | null; status: string; evidence_photo_url: string | null; evidence_signature: string | null; delivered_at: string | null; created_at: string }
        Insert: { id?: string; driver_id?: string | null; order_id?: string | null; estimated_time_min?: number | null; status?: string; evidence_photo_url?: string | null; evidence_signature?: string | null; delivered_at?: string | null; created_at?: string }
        Update: { id?: string; driver_id?: string | null; order_id?: string | null; estimated_time_min?: number | null; status?: string; evidence_photo_url?: string | null; evidence_signature?: string | null; delivered_at?: string | null; created_at?: string }
      }
      delivery_tracking: {
        Row: { id: string; route_id: string; status: string; location_lat: number | null; location_lng: number | null; estimated_arrival: string | null; created_at: string }
        Insert: { id?: string; route_id: string; status: string; location_lat?: number | null; location_lng?: number | null; estimated_arrival?: string | null; created_at?: string }
        Update: { id?: string; route_id?: string; status?: string; location_lat?: number | null; location_lng?: number | null; estimated_arrival?: string | null; created_at?: string }
      }
      audit_log: {
        Row: { id: string; user_id: string | null; action: string; entity_type: string | null; entity_id: string | null; details: Json; ip_address: string | null; created_at: string }
        Insert: { id?: string; user_id?: string | null; action: string; entity_type?: string | null; entity_id?: string | null; details?: Json; ip_address?: string | null; created_at?: string }
        Update: { id?: string; user_id?: string | null; action?: string; entity_type?: string | null; entity_id?: string | null; details?: Json; ip_address?: string | null; created_at?: string }
      }
      notifications_log: {
        Row: { id: string; order_id: string | null; channel: string | null; recipient: string; message: string | null; status: string; attempts: number; sent_at: string | null; created_at: string }
        Insert: { id?: string; order_id?: string | null; channel?: string | null; recipient: string; message?: string | null; status?: string; attempts?: number; sent_at?: string | null; created_at?: string }
        Update: { id?: string; order_id?: string | null; channel?: string | null; recipient?: string; message?: string | null; status?: string; attempts?: number; sent_at?: string | null; created_at?: string }
      }
      loyalty_accounts: {
        Row: { id: string; user_id: string; points: number; lifetime_points: number; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; points?: number; lifetime_points?: number; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string; points?: number; lifetime_points?: number; created_at?: string; updated_at?: string }
      }
      loyalty_transactions: {
        Row: { id: string; account_id: string; type: string | null; points: number; order_id: string | null; expires_at: string | null; created_at: string }
        Insert: { id?: string; account_id: string; type?: string | null; points: number; order_id?: string | null; expires_at?: string | null; created_at?: string }
        Update: { id?: string; account_id?: string; type?: string | null; points?: number; order_id?: string | null; expires_at?: string | null; created_at?: string }
      }
    }
  }
}
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type PizzeriaTables = {
  roles: Database['public']['Tables']['roles']
  profiles: Database['public']['Tables']['profiles']
  tables: Database['public']['Tables']['tables']
  recipes: Database['public']['Tables']['recipes']
  recipe_ingredients: Database['public']['Tables']['recipe_ingredients']
  inventory: Database['public']['Tables']['inventory']
  order_splits: Database['public']['Tables']['order_splits']
  split_items: Database['public']['Tables']['split_items']
  delivery_routes: Database['public']['Tables']['delivery_routes']
  delivery_tracking: Database['public']['Tables']['delivery_tracking']
  audit_log: Database['public']['Tables']['audit_log']
  notifications_log: Database['public']['Tables']['notifications_log']
  loyalty_accounts: Database['public']['Tables']['loyalty_accounts']
  loyalty_transactions: Database['public']['Tables']['loyalty_transactions']
}