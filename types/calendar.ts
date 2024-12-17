export type CuisineType = "1" | "2" | "3" | "4";

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
  dishes: Recipe[];
}

export const CUISINE_COLORS: Record<CuisineType, string> = {
  "1": "bg-rose-100 text-rose-900",
  "2": "bg-amber-100 text-amber-900",
  "3": "bg-blue-100 text-blue-900",
  "4": "bg-purple-100 text-purple-900",
};

export const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
