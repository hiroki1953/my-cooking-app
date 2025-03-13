import {
  getCalendarByGroupId,
  insertCalendarRecipe,
  removeCalendarRow,
} from "@/lib/repositories/calendarRepository";

type Dish = {
  id: number;
  name: string | null;
  category: number | null;
  // "recipe_ingredients" から得られる要素の型に合わせる
  ingredients: Array<{
    // DBの "ingredient_id" を id と呼びたいなら
    id?: number; // or rename ingredient_id → id
    unit: string | null; // DBでは string | null
    quantity: number | null; // DBでは number | null
    ingredients: { ingredient_name: string }[];
    // ↑ データに "ingredients" フィールドが必ずあるなら optional にしなくてもOK
  }>;
  steps: {
    step_id: number;
    step_num: number;
    step_description: string;
  }[];
};

type CalendarDay = {
  id: number; // entry.id
  date: string | null; // entry.date
  dishes: Dish[]; // 複数のdishを持つ
};

export async function fetchCalendar(
  groupId: number,
  date?: string | null
): Promise<CalendarDay[]> {
  // ← CalendarDay[] に
  const data = await getCalendarByGroupId(groupId, date);

  if (!data || data.length === 0) {
    return [];
  }

  const calendarMap: { [key: string]: CalendarDay } = {};

  data.forEach((entry) => {
    // 配列の最初の要素を取り出す

    const dateKey = entry.date; // 変数名をわかりやすく
    const dish = {
      id: entry.recipe_id!,
      name: entry.recipes?.recipe_name || null,
      category: entry.recipes?.category || null,
      ingredients: entry.recipes?.recipe_ingredients || [],
      steps: entry.recipes?.steps || [],
    };

    if (calendarMap[dateKey]) {
      calendarMap[dateKey].dishes.push(dish);
    } else {
      calendarMap[dateKey] = {
        id: entry.id,
        date: dateKey,
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
export async function removeCalendarRecipe(
  groupId: number,
  date: string | null,
  recipeId: number
) {
  if (!date) {
    throw new Error("date is required to delete a calendar recipe");
  }
  if (!recipeId) {
    throw new Error("recipeId is missing");
  }

  await removeCalendarRow(groupId, date, recipeId);
  // 戻り値が必要なら返す。今回は単に完了を示すだけ
}
