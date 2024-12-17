import { RecipeBadge } from "./recipe-badge";
import { DayRecipe } from "../types/calendar";

interface RecipeDetailsProps {
  selectedDate: Date;
  recipes: DayRecipe[];
}

export function RecipeDetails({ selectedDate, recipes }: RecipeDetailsProps) {
  const selectedRecipes =
    recipes.find(
      (r) =>
        r.date.getDate() === selectedDate.getDate() &&
        r.date.getMonth() === selectedDate.getMonth() &&
        r.date.getFullYear() === selectedDate.getFullYear()
    )?.recipes || [];

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">
        {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月
        {selectedDate.getDate()}日の料理
      </h2>
      {selectedRecipes.length > 0 ? (
        <ul className="space-y-4">
          {selectedRecipes.map((recipe) => (
            <li key={recipe.id} className="flex items-start space-x-4">
              <RecipeBadge recipe={recipe} />
              <div>
                <h3 className="text-lg font-medium">{recipe.name}</h3>
                <p className="text-gray-600">
                  料理の詳細説明をここに追加します。
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">この日の料理は登録されていません。</p>
      )}
    </div>
  );
}
