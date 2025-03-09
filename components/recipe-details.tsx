import { RecipeBadge } from "./recipe-badge";
import { DayRecipe } from "../types/calendar";
import Link from "next/link";
import { ReceiptText } from "lucide-react";

interface RecipeDetailsProps {
  selectedDate: Date;
  recipes: DayRecipe[];
  groupId: string | null;
}

export function RecipeDetails({
  selectedDate,
  recipes,
  groupId,
}: RecipeDetailsProps) {
  const selectedRecipes =
    recipes.find(
      (r) =>
        r.date.getDate() === selectedDate.getDate() &&
        r.date.getMonth() === selectedDate.getMonth() &&
        r.date.getFullYear() === selectedDate.getFullYear()
    )?.recipes || [];

  return (
    <div className="bg-white rounded-lg shadow p-4 pb-16 mt-4 relative">
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
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">この日の料理は登録されていません。</p>
      )}
      {groupId && (
        <Link
          href={`meal/${selectedDate.getFullYear()}-${
            selectedDate.getMonth() + 1
          }-${selectedDate.getDate()}`}
          className="absolute right-4 bottom-4 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 flex items-center gap-2 px-4 py-2"
        >
          <ReceiptText />
        </Link>
      )}
    </div>
  );
}
