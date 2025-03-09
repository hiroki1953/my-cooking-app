import { supabase } from "@/lib/initSupabase";

export async function getCalendarByGroupId(
  groupId: number,
  date?: string | null
) {
  // ベースクエリ
  let query = supabase
    .from("calendar_recipes")
    .select(
      `
        id,
        date,
        recipe_id,
        recipes:recipe_id (
          recipe_name,
          category,
          steps (
            step_id,
            step_num,
            step_description
          ),
          recipe_ingredients (
            quantity,
            unit,
            ingredient_id,
            ingredients:ingredient_id (
              ingredient_name
            )
          )
        )
      `
    )
    .eq("group_id", groupId)
    .order("date", { ascending: true });

  // クエリパラメータ date がある場合にフィルタリング
  if (date) {
    query = query.eq("date", date);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Database error");
  }

  return data;
}

export async function insertCalendarRecipe(
  groupId: number,
  date: string,
  recipeId: number
) {

  const { data, error } = await supabase
    .from("calendar_recipes")
    .insert({
      group_id: groupId,
      date,
      recipe_id: recipeId,
    })
    .select(); // 挿入した行を返す

  if (error) {
    throw new Error(error.message);
  }

  return data; // 挿入されたレコードの配列
}

// ✅ 削除
export async function removeCalendarRow(groupId: number, date: string, recipeId: number) {
  let query = supabase
    .from("calendar_recipes")
    .delete()
    .eq("group_id", groupId)
    .eq("recipe_id", recipeId)
    .eq("date", date); // 同一dateのレコードだけ消す

  const { data, error } = await query;

  if (error) {
    throw new Error("Error deleting calendar recipe: " + error.message);
  }
  // data は削除したレコードの配列
  return data;
}
