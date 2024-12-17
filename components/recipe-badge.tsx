import { Recipe, CUISINE_COLORS } from "../types/calendar";

interface RecipeBadgeProps {
  recipe: Recipe;
}

export function RecipeBadge({ recipe }: RecipeBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded-md text-sm ${
        CUISINE_COLORS[recipe.category]
      }`}
    >
      {recipe.name}
    </span>
  );
}
