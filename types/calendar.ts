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
