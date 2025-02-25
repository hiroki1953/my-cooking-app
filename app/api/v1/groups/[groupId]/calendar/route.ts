import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

// `calendar_recipes` のレスポンス型を定義
type CalendarRecipe = {
  id: number;
  date: string | null;
  recipe_id: number | null;
  recipe_name: string | null;
  recipe_category: number | null;
};

export async function GET(
  req: NextRequest,
  context: { params: { groupId?: string } }
) {
  console.log("Received params:", context.params);

  if (!context.params?.groupId) {
    return NextResponse.json({ error: "groupId is missing" }, { status: 400 });
  }

  const groupId = parseInt(context.params.groupId, 10);
  if (isNaN(groupId)) {
    return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
  }

  // ✅ Supabase からカレンダー情報を取得
  const { data, error } = await supabase
    .from("calendar_recipes")
    .select(
      `
      id,
      date,
      recipe_id,
      recipes:recipe_id (recipe_name, category)
    `
    )
    .eq("group_id", groupId)
    .order("date", { ascending: true });

  if (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Group not found or no calendar entries" },
      { status: 404 }
    );
  }

  // ✅ `recipes[0]?.recipe_name` で配列の最初の要素を取得
  const response: CalendarRecipe[] = data.map((entry) => ({
    id: entry.id,
    date: entry.date,
    recipe_id: entry.recipe_id,
    recipe_name: entry.recipes?.[0]?.recipe_name || null, // ✅ `recipes[0]` に変更
    recipe_category: entry.recipes?.[0]?.category || null, // ✅ `recipes[0]` に変更
  }));

  return NextResponse.json(response, { status: 200 });
}
