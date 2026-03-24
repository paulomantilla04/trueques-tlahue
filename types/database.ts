export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      barter_items: {
        Row: {
          description: string | null
          estimated_value: number | null
          id: string
          offer_id: string
          owner_id: string
          title: string
        }
        Insert: {
          description?: string | null
          estimated_value?: number | null
          id?: string
          offer_id: string
          owner_id: string
          title: string
        }
        Update: {
          description?: string | null
          estimated_value?: number | null
          id?: string
          offer_id?: string
          owner_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "barter_items_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barter_items_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          id: string
          offer_id: string
          sender_id: string
          sent_at: string
        }
        Insert: {
          body: string
          id?: string
          offer_id: string
          sender_id: string
          sent_at?: string
        }
        Update: {
          body?: string
          id?: string
          offer_id?: string
          sender_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_history: {
        Row: {
          action: Database["public"]["Enums"]["offer_status"]
          actor_id: string
          created_at: string
          id: string
          notes: string | null
          offer_id: string
          price_snapshot: number | null
        }
        Insert: {
          action: Database["public"]["Enums"]["offer_status"]
          actor_id: string
          created_at?: string
          id?: string
          notes?: string | null
          offer_id: string
          price_snapshot?: number | null
        }
        Update: {
          action?: Database["public"]["Enums"]["offer_status"]
          actor_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          offer_id?: string
          price_snapshot?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_history_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          notes: string | null
          parent_offer_id: string | null
          product_id: string
          proposed_price: number | null
          status: Database["public"]["Enums"]["offer_status"]
          type: Database["public"]["Enums"]["offer_type"]
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          notes?: string | null
          parent_offer_id?: string | null
          product_id: string
          proposed_price?: number | null
          status?: Database["public"]["Enums"]["offer_status"]
          type: Database["public"]["Enums"]["offer_type"]
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          parent_offer_id?: string | null
          product_id?: string
          proposed_price?: number | null
          status?: Database["public"]["Enums"]["offer_status"]
          type?: Database["public"]["Enums"]["offer_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_parent_offer_id_fkey"
            columns: ["parent_offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          id?: string
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          id?: string
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          condition: Database["public"]["Enums"]["product_condition"]
          created_at: string
          description: string | null
          id: string
          included_items: string | null
          price: number | null
          search_vector: unknown
          seller_id: string
          status: Database["public"]["Enums"]["product_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category_id: string
          condition: Database["public"]["Enums"]["product_condition"]
          created_at?: string
          description?: string | null
          id?: string
          included_items?: string | null
          price?: number | null
          search_vector?: unknown
          seller_id: string
          status?: Database["public"]["Enums"]["product_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          condition?: Database["public"]["Enums"]["product_condition"]
          created_at?: string
          description?: string | null
          id?: string
          included_items?: string | null
          price?: number | null
          search_vector?: unknown
          seller_id?: string
          status?: Database["public"]["Enums"]["product_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_user_id: string
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          auth_user_id: string
          avatar_url?: string | null
          created_at?: string
          display_name: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          auth_user_id?: string
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      transaction_barter_items: {
        Row: {
          barter_item_id: string | null
          description: string | null
          estimated_value: number | null
          id: string
          title: string
          transaction_id: string
        }
        Insert: {
          barter_item_id?: string | null
          description?: string | null
          estimated_value?: number | null
          id?: string
          title: string
          transaction_id: string
        }
        Update: {
          barter_item_id?: string | null
          description?: string | null
          estimated_value?: number | null
          id?: string
          title?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_barter_items_barter_item_id_fkey"
            columns: ["barter_item_id"]
            isOneToOne: false
            referencedRelation: "barter_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_barter_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          buyer_confirmed: boolean
          buyer_id: string
          created_at: string
          final_price: number | null
          id: string
          offer_id: string
          product_id: string
          seller_confirmed: boolean
          seller_id: string
          status: Database["public"]["Enums"]["transaction_status"]
        }
        Insert: {
          buyer_confirmed?: boolean
          buyer_id: string
          created_at?: string
          final_price?: number | null
          id?: string
          offer_id: string
          product_id: string
          seller_confirmed?: boolean
          seller_id: string
          status?: Database["public"]["Enums"]["transaction_status"]
        }
        Update: {
          buyer_confirmed?: boolean
          buyer_id?: string
          created_at?: string
          final_price?: number | null
          id?: string
          offer_id?: string
          product_id?: string
          seller_confirmed?: boolean
          seller_id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: true
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_offer: {
        Args: { p_actor_id: string; p_offer_id: string }
        Returns: string
      }
      auth_profile_id: { Args: never; Returns: string }
      cancel_offer: {
        Args: { p_actor_id: string; p_offer_id: string }
        Returns: undefined
      }
      complete_transaction: {
        Args: { p_actor_id: string; p_transaction_id: string }
        Returns: undefined
      }
      create_counteroffer:
        | {
            Args: {
              p_actor_id: string
              p_barter_items: Database["public"]["CompositeTypes"]["barter_item_input"][]
              p_new_price: number
              p_offer_id: string
            }
            Returns: string
          }
        | {
            Args: {
              p_actor_id: string
              p_barter_items: Database["public"]["CompositeTypes"]["barter_item_input"][]
              p_new_price: number
              p_notes?: string
              p_offer_id: string
            }
            Returns: string
          }
      is_admin: { Args: never; Returns: boolean }
      open_dispute: {
        Args: { p_actor_id: string; p_transaction_id: string }
        Returns: undefined
      }
      reject_offer: {
        Args: { p_actor_id: string; p_offer_id: string }
        Returns: undefined
      }
    }
    Enums: {
      offer_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "countered"
        | "canceled"
        | "invalidated"
      offer_type: "direct_buy" | "negotiation"
      product_condition: "new" | "like_new" | "good" | "fair" | "poor"
      product_status:
        | "active"
        | "reserved"
        | "sold"
        | "pending_approval"
        | "rejected"
      transaction_status: "pending" | "completed" | "disputed"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      barter_item_input: {
        title: string | null
        description: string | null
        estimated_value: number | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      offer_status: [
        "pending",
        "accepted",
        "rejected",
        "countered",
        "canceled",
        "invalidated",
      ],
      offer_type: ["direct_buy", "negotiation"],
      product_condition: ["new", "like_new", "good", "fair", "poor"],
      product_status: [
        "active",
        "reserved",
        "sold",
        "pending_approval",
        "rejected",
      ],
      transaction_status: ["pending", "completed", "disputed"],
      user_role: ["user", "admin"],
    },
  },
} as const
