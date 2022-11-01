export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cafeteria: {
        Row: {
          id: number
          name: string
          image: string
          about: string | null
          slug: string
          owner_id: string | null
        }
        Insert: {
          id?: number
          name: string
          image?: string
          about?: string | null
          slug: string
          owner_id?: string | null
        }
        Update: {
          id?: number
          name?: string
          image?: string
          about?: string | null
          slug?: string
          owner_id?: string | null
        }
      }
      cart: {
        Row: {
          id: number
          user_id: string
          totalAmount: number
          cafe_id: number
          createdAt: string
        }
        Insert: {
          id?: number
          user_id: string
          totalAmount?: number
          cafe_id: number
          createdAt?: string
        }
        Update: {
          id?: number
          user_id?: string
          totalAmount?: number
          cafe_id?: number
          createdAt?: string
        }
      }
      cart_item: {
        Row: {
          id: number
          cart_id: number
          total_price: number
          qty: number
          menu_id: number
          createdAt: string
        }
        Insert: {
          id?: number
          cart_id: number
          total_price: number
          qty?: number
          menu_id: number
          createdAt?: string
        }
        Update: {
          id?: number
          cart_id?: number
          total_price?: number
          qty?: number
          menu_id?: number
          createdAt?: string
        }
      }
      menu: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          image: string
          available: boolean | null
          cafe_id: number
          category_id: number | null
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price: number
          image: string
          available?: boolean | null
          cafe_id: number
          category_id?: number | null
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number
          image?: string
          available?: boolean | null
          cafe_id?: number
          category_id?: number | null
        }
      }
      menu_category: {
        Row: {
          id: number
          cafe_id: number | null
          name: string
        }
        Insert: {
          id?: number
          cafe_id?: number | null
          name: string
        }
        Update: {
          id?: number
          cafe_id?: number | null
          name?: string
        }
      }
      order: {
        Row: {
          id: number
          user_id: string
          date: string
          amount: number
          status: string
          payment_ref: string
          cafe_id: number
        }
        Insert: {
          id?: number
          user_id: string
          date?: string
          amount: number
          status?: string
          payment_ref: string
          cafe_id: number
        }
        Update: {
          id?: number
          user_id?: string
          date?: string
          amount?: number
          status?: string
          payment_ref?: string
          cafe_id?: number
        }
      }
      order_item: {
        Row: {
          id: number
          order_id: number
          total_price: number
          qty: number
          menu_id: number
        }
        Insert: {
          id?: never
          order_id: number
          total_price: number
          qty: number
          menu_id: number
        }
        Update: {
          id?: never
          order_id?: number
          total_price?: number
          qty?: number
          menu_id?: number
        }
      }
      review: {
        Row: {
          id: number
          user_id: string
          cafe_id: number
          content: string
          rating: number
          date: string
        }
        Insert: {
          id?: number
          user_id: string
          cafe_id: number
          content: string
          rating: number
          date?: string
        }
        Update: {
          id?: number
          user_id?: string
          cafe_id?: number
          content?: string
          rating?: number
          date?: string
        }
      }
      user: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          avatar_url: string | null
          firstname: string | null
          lastname: string | null
          address: string | null
          phone: string | null
          gender: string | null
          email: string
          role: Database["public"]["Enums"]["role"]
          created_at: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
          firstname?: string | null
          lastname?: string | null
          address?: string | null
          phone?: string | null
          gender?: string | null
          email: string
          role?: Database["public"]["Enums"]["role"]
          created_at?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
          firstname?: string | null
          lastname?: string | null
          address?: string | null
          phone?: string | null
          gender?: string | null
          email?: string
          role?: Database["public"]["Enums"]["role"]
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_cafe_owner_order: {
        Args: { cafe_id: number }
        Returns: boolean
      }
      get_users_with_cafe_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      role: "CUSTOMER" | "CAFE_OWNER"
    }
  }
}
