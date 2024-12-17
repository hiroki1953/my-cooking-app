import { supabase } from "@/lib/initSupabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date"); // クエリパラメータから`date`を取得

  // Supabaseからデータを取得
  const { data, error } = await supabase
    .from("calendar")
    .select(
      `
      dishes(
        id,
        name,
        description,
        category,
        ingredients (
          id,
          name,
          unit
        ),
        steps (
        id,
        step,
        description)
      )
      `
    )
    .eq("date", date);

  if (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0].dishes);
}

export async function POST(request: Request) {
  const { date, dish } = await request.json();

  const { data: calendarId, error: calendarError } = await supabase
    .from("calendar")
    .select("id")
    .eq("date", date);

  if (calendarError) {
    return NextResponse.json({ error: calendarError.message }, { status: 500 });
  }

  // データを挿入
  const { data: dishData, error: dishError } = await supabase
    .from("dishes")
    .insert({
      name: dish.name,
      description: dish.description,
      category: dish.category,
      calendar_id: calendarId[0].id,
    }) // dateを保存
    .select();

  if (dishError) {
    return NextResponse.json({ error: dishError.message }, { status: 500 });
  }

  // 材料を挿入
  const { error: ingredientError } = await supabase.from("ingredients").insert(
    dish.ingredients.map((ingredient: { name: string; unit: string }) => ({
      dish_id: dishData[0].id,
      name: ingredient.name,
      unit: ingredient.unit,
    }))
  );

  if (ingredientError) {
    return NextResponse.json(
      { error: ingredientError.message },
      { status: 500 }
    );
  }

  // 材料を挿入
  const { error: stepError } = await supabase.from("steps").insert(
    dish.steps.map((step: { step: string; description: string }) => ({
      dish_id: dishData[0].id,
      step: step.step,
      description: step.description,
    }))
  );

  if (stepError) {
    return NextResponse.json({ error: stepError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETEリクエストハンドラ
export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    // dishes テーブルから指定された id を削除
    const { error } = await supabase
      .from("dishes")
      .update({ calendar_id: null }) // カラムの値をNULLに設定
      .eq("id", id); // 対象の行を指定
    if (error) {
      return NextResponse.json(
        { message: "Error deleting dish", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `Dish with id ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred", error },
      { status: 500 }
    );
  }
}
