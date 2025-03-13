import {
  getRecipeByGroupId,
  insertIngredients,
  insertSteps,
  insertRecipe,
  linkRecipeToGroup,
  updateRecipeRow,
  updateIngredients,
  updateSteps,
  getRecipeByRecipeId,
} from "@/lib/repositories/recipeRepository";

export async function fetchRecipe(groupId: number) {
  const data = await getRecipeByGroupId(groupId);

  if (!data || data.length === 0) {
    return [];
  }

  return data;
}
export async function fetchRecipeById(recipeId: number) {
  const data = await getRecipeByRecipeId(recipeId); // recipeIdを使って取得する関数がないので、groupIdを使って取得する関数を使う
  if (!data || data.length === 0) {
    return null;
  }
  return data[0];
}

// ✅ 新規レシピを作成
export async function createRecipe(
  groupId: number,
  name: string,
  category: string,
  ingredients: any[],
  steps: any[]
) {
  // 1) recipesテーブルにレシピ情報をINSERT
  const newRecipe = await insertRecipe(name, category);

  // 2) group_recipesテーブルに (group_id, recipe_id) をINSERT
  await linkRecipeToGroup(groupId, newRecipe.recipe_id);

  // 3) ingredientsをINSERT (必要があれば)
  if (ingredients && ingredients.length > 0) {
    await insertIngredients(newRecipe.recipe_id, ingredients);
  }

  // 3) stepsをINSERT (必要があれば)
  if (steps && steps.length > 0) {
    await insertSteps(newRecipe.recipe_id, steps);
  }

  return newRecipe;
}

export async function updateRecipe(recipeId: number, body: any) {
  const { name, category, ingredients, steps } = body;
  // 1) recipe本体を更新
  const updatedRecipe = await updateRecipeRow(recipeId, name, category);
  // 2) ingredients, stepsをまとめて更新
  if (ingredients) {
    await updateIngredients(recipeId, ingredients);
  }
  if (steps) {
    await updateSteps(recipeId, steps);
  }
  // 更新結果を返す
  return { ...updatedRecipe };
}
