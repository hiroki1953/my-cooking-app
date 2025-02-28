export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calendar_recipes: {
        Row: {
          created_at: string
          date: string | null
          group_id: number
          id: number
          recipe_id: number | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          group_id: number
          id?: number
          recipe_id?: number | null
        }
        Update: {
          created_at?: string
          date?: string | null
          group_id?: number
          id?: number
          recipe_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_entries_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "calendar_entries_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: number
          joined_at: string
          user_id: string | null
        }
        Insert: {
          group_id: number
          joined_at?: string
          user_id?: string | null
        }
        Update: {
          group_id?: number
          joined_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
        ]
      }
      group_recipes: {
        Row: {
          created_at: string
          group_id: number
          id: number
          recipe_id: number
        }
        Insert: {
          created_at?: string
          group_id: number
          id?: number
          recipe_id: number
        }
        Update: {
          created_at?: string
          group_id?: number
          id?: number
          recipe_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_recipes_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "group_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      groups: {
        Row: {
          created_by_user_id: string | null
          group_id: number
          group_name: string
        }
        Insert: {
          created_by_user_id?: string | null
          group_id?: number
          group_name: string
        }
        Update: {
          created_by_user_id?: string | null
          group_id?: number
          group_name?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          ingredient_id: number
          ingredient_name: string
        }
        Insert: {
          ingredient_id?: number
          ingredient_name: string
        }
        Update: {
          ingredient_id?: number
          ingredient_name?: string
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          ingredient_id: number
          quantity: number | null
          recipe_id: number
          unit: string | null
        }
        Insert: {
          ingredient_id: number
          quantity?: number | null
          recipe_id: number
          unit?: string | null
        }
        Update: {
          ingredient_id?: number
          quantity?: number | null
          recipe_id?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["ingredient_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      recipes: {
        Row: {
          calories: number | null
          carbohydrate: number | null
          category: number | null
          cooking_time: number | null
          created_at: string
          fat: number | null
          protein: number | null
          recipe_id: number
          recipe_name: string
          servings: number
        }
        Insert: {
          calories?: number | null
          carbohydrate?: number | null
          category?: number | null
          cooking_time?: number | null
          created_at?: string
          fat?: number | null
          protein?: number | null
          recipe_id?: number
          recipe_name: string
          servings: number
        }
        Update: {
          calories?: number | null
          carbohydrate?: number | null
          category?: number | null
          cooking_time?: number | null
          created_at?: string
          fat?: number | null
          protein?: number | null
          recipe_id?: number
          recipe_name?: string
          servings?: number
        }
        Relationships: []
      }
      steps: {
        Row: {
          recipe_id: number
          step_description: string | null
          step_id: number
          step_num: number
        }
        Insert: {
          recipe_id: number
          step_description?: string | null
          step_id?: number
          step_num: number
        }
        Update: {
          recipe_id?: number
          step_description?: string | null
          step_id?: number
          step_num?: number
        }
        Relationships: [
          {
            foreignKeyName: "steps_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
