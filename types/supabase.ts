export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      calendar: {
        Row: {
          calendar_id: number;
          date: string;
        };
        Insert: {
          calendar_id?: number;
          date: string;
        };
        Update: {
          calendar_id?: number;
          date?: string;
        };
        Relationships: [];
      };
      group_members: {
        Row: {
          group_id: number;
          joined_at: string;
          user_id: number;
        };
        Insert: {
          group_id: number;
          joined_at?: string;
          user_id: number;
        };
        Update: {
          group_id?: number;
          joined_at?: string;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["group_id"];
          },
          {
            foreignKeyName: "group_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      groups: {
        Row: {
          created_by_user_id: number;
          group_id: number;
          group_name: string;
        };
        Insert: {
          created_by_user_id: number;
          group_id?: number;
          group_name: string;
        };
        Update: {
          created_by_user_id?: number;
          group_id?: number;
          group_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "groups_created_by_user_id_fkey";
            columns: ["created_by_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      ingredients: {
        Row: {
          ingredient_id: number;
          ingredient_name: string;
        };
        Insert: {
          ingredient_id?: number;
          ingredient_name: string;
        };
        Update: {
          ingredient_id?: number;
          ingredient_name?: string;
        };
        Relationships: [];
      };
      recipe_ingredients: {
        Row: {
          ingredient_id: number;
          quantity: number | null;
          recipe_id: number;
          unit: string | null;
        };
        Insert: {
          ingredient_id: number;
          quantity?: number | null;
          recipe_id: number;
          unit?: string | null;
        };
        Update: {
          ingredient_id?: number;
          quantity?: number | null;
          recipe_id?: number;
          unit?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["ingredient_id"];
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["recipe_id"];
          },
        ];
      };
      recipes: {
        Row: {
          calendar_id: number;
          calories: number | null;
          carbohydrate: number | null;
          category: string | null;
          cooking_time: number | null;
          created_at: string;
          fat: number | null;
          protein: number | null;
          recipe_id: number;
          recipe_name: string;
          servings: number;
        };
        Insert: {
          calendar_id: number;
          calories?: number | null;
          carbohydrate?: number | null;
          category?: string | null;
          cooking_time?: number | null;
          created_at?: string;
          fat?: number | null;
          protein?: number | null;
          recipe_id?: number;
          recipe_name: string;
          servings: number;
        };
        Update: {
          calendar_id?: number;
          calories?: number | null;
          carbohydrate?: number | null;
          category?: string | null;
          cooking_time?: number | null;
          created_at?: string;
          fat?: number | null;
          protein?: number | null;
          recipe_id?: number;
          recipe_name?: string;
          servings?: number;
        };
        Relationships: [
          {
            foreignKeyName: "recipes_calendar_id_fkey";
            columns: ["calendar_id"];
            isOneToOne: false;
            referencedRelation: "calendar";
            referencedColumns: ["calendar_id"];
          },
        ];
      };
      steps: {
        Row: {
          recipe_id: number;
          step_description: string | null;
          step_id: number;
          step_num: number;
        };
        Insert: {
          recipe_id: number;
          step_description?: string | null;
          step_id?: number;
          step_num: number;
        };
        Update: {
          recipe_id?: number;
          step_description?: string | null;
          step_id?: number;
          step_num?: number;
        };
        Relationships: [
          {
            foreignKeyName: "steps_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["recipe_id"];
          },
        ];
      };
      users: {
        Row: {
          email: string;
          password_hash: string;
          user_id: number;
          user_name: string;
        };
        Insert: {
          email: string;
          password_hash: string;
          user_id?: number;
          user_name: string;
        };
        Update: {
          email?: string;
          password_hash?: string;
          user_id?: number;
          user_name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

// Schema: public
// Tables
export type Calendar = Database["public"]["Tables"]["calendar"]["Row"];
export type InsertCalendar = Database["public"]["Tables"]["calendar"]["Insert"];
export type UpdateCalendar = Database["public"]["Tables"]["calendar"]["Update"];

export type GroupMembers = Database["public"]["Tables"]["group_members"]["Row"];
export type InsertGroupMembers =
  Database["public"]["Tables"]["group_members"]["Insert"];
export type UpdateGroupMembers =
  Database["public"]["Tables"]["group_members"]["Update"];

export type Groups = Database["public"]["Tables"]["groups"]["Row"];
export type InsertGroups = Database["public"]["Tables"]["groups"]["Insert"];
export type UpdateGroups = Database["public"]["Tables"]["groups"]["Update"];

export type Ingredients = Database["public"]["Tables"]["ingredients"]["Row"];
export type InsertIngredients =
  Database["public"]["Tables"]["ingredients"]["Insert"];
export type UpdateIngredients =
  Database["public"]["Tables"]["ingredients"]["Update"];

export type RecipeIngredients =
  Database["public"]["Tables"]["recipe_ingredients"]["Row"];
export type InsertRecipeIngredients =
  Database["public"]["Tables"]["recipe_ingredients"]["Insert"];
export type UpdateRecipeIngredients =
  Database["public"]["Tables"]["recipe_ingredients"]["Update"];

export type Recipes = Database["public"]["Tables"]["recipes"]["Row"];
export type InsertRecipes = Database["public"]["Tables"]["recipes"]["Insert"];
export type UpdateRecipes = Database["public"]["Tables"]["recipes"]["Update"];

export type Steps = Database["public"]["Tables"]["steps"]["Row"];
export type InsertSteps = Database["public"]["Tables"]["steps"]["Insert"];
export type UpdateSteps = Database["public"]["Tables"]["steps"]["Update"];

export type Users = Database["public"]["Tables"]["users"]["Row"];
export type InsertUsers = Database["public"]["Tables"]["users"]["Insert"];
export type UpdateUsers = Database["public"]["Tables"]["users"]["Update"];
