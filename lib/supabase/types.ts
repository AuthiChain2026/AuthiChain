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
      products: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          category: string | null
          brand: string | null
          image_url: string | null
          truemark_id: string | null
          truemark_data: Json | null
          blockchain_tx_hash: string | null
          is_registered: boolean
          industry_id: string | null
          workflow: Json | null
          story: string | null
          features: Json | null
          authenticity_features: Json | null
          confidence: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          category?: string | null
          brand?: string | null
          image_url?: string | null
          truemark_id?: string | null
          truemark_data?: Json | null
          blockchain_tx_hash?: string | null
          is_registered?: boolean
          industry_id?: string | null
          workflow?: Json | null
          story?: string | null
          features?: Json | null
          authenticity_features?: Json | null
          confidence?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          category?: string | null
          brand?: string | null
          image_url?: string | null
          truemark_id?: string | null
          truemark_data?: Json | null
          blockchain_tx_hash?: string | null
          is_registered?: boolean
          industry_id?: string | null
          workflow?: Json | null
          story?: string | null
          features?: Json | null
          authenticity_features?: Json | null
          confidence?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      scans: {
        Row: {
          id: string
          product_id: string
          scan_result: string
          confidence: number | null
          location: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          scan_result: string
          confidence?: number | null
          location?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          scan_result?: string
          confidence?: number | null
          location?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Product = Database['public']['Tables']['products']['Row']
export type Scan = Database['public']['Tables']['scans']['Row']
