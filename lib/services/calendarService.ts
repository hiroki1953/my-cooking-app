import { getCalendarByGroupId,insertCalendarRecipe,removeCalendarRow } from "@/lib/repositories/calendarRepository";

type CalendarRecipe = {
  id: number;
  date: string | null;
  recipe_id: number | null;
  recipe_name: string | null;
  recipe_category: number | null;
};

export async function fetchCalendar(groupId: number,date?: string | null): Promise<CalendarRecipe[]> {
  const data = await getCalendarByGroupId(groupId, date);

  if (!data || data.length === 0) {
    return [];
  }

  const calendarMap: { [key: string]: CalendarRecipe } = {};

  data.forEach((entry) => {
    const date = entry.date;
    const dish = {
      id: entry.recipe_id,
      name: entry.recipes?.recipe_name || null,
      category: entry.recipes?.category || null,
      ingredients: entry.recipes.recipe_ingredients || [],
      steps: entry.recipes.steps || [],
    };

    if (calendarMap[date]) {
      calendarMap[date].dishes.push(dish);
    } else {
      calendarMap[date] = {
        id: entry.id,
        date: date,
        dishes: [dish],
      };
    }
  });

  return Object.values(calendarMap);
}

export async function addCalendarRecipe(
  groupId: number,
  date: string,
  recipeId: number
) {
  // 入力チェック
  if (!date || !recipeId) {
    throw new Error("date and recipe_id are required");
  }

  // リポジトリを呼び出してINSERT実行
  const insertedData = await insertCalendarRecipe(groupId, date, recipeId);
  return insertedData;
}

// ✅ 削除処理
export async function removeCalendarRecipe(groupId: number, date: string | null, recipeId: number) {
  if (!date) {
    throw new Error("date is required to delete a calendar recipe");
  }
  if (!recipeId) {
    throw new Error("recipeId is missing");
  }

  await removeCalendarRow(groupId, date, recipeId);
  // 戻り値が必要なら返す。今回は単に完了を示すだけ
}
