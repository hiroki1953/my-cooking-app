export type CuisineType = 1 | 2 | 3 | 4;

export interface Recipe {
  id: string;
  name: string;
  category: CuisineType;
}

export interface DayRecipe {
  date: Date;
  recipes: Recipe[];
}

export interface CalendarRecipe {
  date: Date;
  recipes: Recipe[];
}

export const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export type CalendarRecipeRow = {
  id: number;
  date: string;
  recipe_id: number | null;
  recipes: {
    recipe_name: string;
    category: number;
    steps: {
      step_id: number;
      step_num: number;
      step_description: string;
    }[];
    recipe_ingredients: {
      quantity: number | null;
      unit: string | null;
      ingredient_id: number;
      ingredients: {
        ingredient_name: string;
      }[];
    }[];
  };
}[];
