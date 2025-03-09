// app/recipes/[recipeId]/page.tsx

import { RecipeForm } from "@/components/RecipeForm"; // 編集フォーム用のコンポーネント例
import { fetchFromApi } from "@/lib/fetch";

// 既存メニュー一覧の型（イメージ）
type Recipe = {
  recipe_id: number;
  recipe_name: string;
  category: string;
  steps: { step_id: number; step_num: number; step_description: string }[];
  recipe_ingredients: {
    quantity: string;
    unit: string;
    ingredient_id: number;
    ingredients: { ingredient_name: string };
  }[];
};

// サーバーコンポーネント
export default async function RecipeEditPage({
  params,
}: {
  params: { groupId: string; recipeId: string };
}) {
  // 1) 既存データを取得
  const groupId = params.groupId;

  const recipeId = params.recipeId;

  const recipe = await getRecipe(groupId, recipeId);
  if (!recipe) {
    return <div>レシピが見つかりませんでした</div>;
  }

  // 2) フォームコンポーネントに初期値を渡す
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">レシピ編集</h1>
      <RecipeForm initialRecipe={recipe} groupId={groupId} />
    </div>
  );
}

// サーバーサイドでデータ取得
async function getRecipe(
  groupId: string,
  recipeId: string
): Promise<Recipe | null> {
  const data = await fetchFromApi(
    `/api/v1/groups/${groupId}/recipes?recipeId=${recipeId}`,
    {
      cache: "no-store",
    }
  );
  if (!data) {
    return null;
  }

  return data;
}
