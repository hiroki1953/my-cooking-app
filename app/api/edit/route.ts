import { supabase } from "@/lib/initSupabase";
import { Ingredient, Step } from "@/types/dish";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("id"); // クエリパラメータから`date`を取得

  // Supabaseからデータを取得
  const { data, error } = await supabase
    .from("dishes")
    .select(
      `
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
      `
    )
    .eq("id", date);

  if (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { id, dish } = await request.json();

  // データを更新
  const { error: dishError } = await supabase
    .from("dishes")
    .update({
      name: dish.name,
      description: dish.description,
      category: dish.category,
    })
    .eq("id", id);

  if (dishError) {
    console.error("Error updating dish:", dishError);
    return NextResponse.json({ error: dishError.message }, { status: 500 });
  }

  if (dish.ingredients.length > 0) {
    // 更新と新規挿入用の配列を準備
    const existingIngredientData: Ingredient[] = [];
    const newIngredientData: Ingredient[] = [];

    // 更新用と新規挿入用に振り分け
    dish.ingredients.forEach((ingredient: Ingredient) => {
      if (ingredient.id !== 0) {
        existingIngredientData.push(ingredient); // idが存在する場合は更新
      } else {
        newIngredientData.push(ingredient); // idが存在しない場合は新規挿入
      }
    });

    try {
      // **既存データの更新**
      if (existingIngredientData.length > 0) {
        const updatePromises = existingIngredientData.map(
          async (ingredient) => {
            const { error: updateError } = await supabase
              .from("ingredients")
              .update({
                name: ingredient.name,
                unit: ingredient.unit, // 必要なカラムを指定
              })
              .eq("id", ingredient.id); // IDで対象データを特定

            if (updateError) {
              throw updateError; // エラーがあればスロー
            }
          }
        );

        await Promise.all(updatePromises); // 全ての更新処理を待機
        console.log("All existing data updated successfully");
      }

      // **新規データの挿入**
      if (newIngredientData.length > 0) {
        const insertPromises = newIngredientData.map(async (ingredient) => {
          const { error: insertError } = await supabase
            .from("ingredients")
            .insert({
              name: ingredient.name,
              unit: ingredient.unit,
              dish_id: id,
            });

          if (insertError) {
            throw insertError; // エラーがあればスロー
          }
        });

        await Promise.all(insertPromises); // 全ての挿入処理を待機
        console.log("All new data inserted successfully");
      }
    } catch (error) {
      console.error("Error updating, inserting, or deleting data:", error);
      return NextResponse.json(
        { error: "Failed to update ingredients" },
        { status: 500 }
      );
    }
  }
  if (dish.steps.length > 0) {
    console.log(dish.steps);

    // 更新と新規挿入用の配列を準備
    const existingStepData: Step[] = [];
    const newStepsData: Step[] = [];

    // 更新用と新規挿入用に振り分け
    dish.steps.forEach((step: Step) => {
      if (step.id) {
        existingStepData.push(step); // idが存在する場合は更新
      } else {
        newStepsData.push(step); // idが存在しない場合は新規挿入
      }
    });

    try {
      // **既存データの更新**
      if (existingStepData.length > 0) {
        const updatePromises = existingStepData.map(async (step) => {
          const { error: updateError } = await supabase
            .from("steps")
            .update({
              step: step.step,
              description: step.description, // 必要なカラムを指定
            })
            .eq("id", step.id); // IDで対象データを特定

          if (updateError) {
            throw updateError; // エラーがあればスロー
          }
        });

        await Promise.all(updatePromises); // 全ての更新処理を待機
        console.log("All existing data updated successfully");
      }

      // **新規データの挿入**
      if (newStepsData.length > 0) {
        const insertPromises = newStepsData.map(async (step) => {
          const { error: insertError } = await supabase.from("steps").insert({
            step: step.step,
            description: step.description, // 必要なカラムを指定
            dish_id: id,
          });

          if (insertError) {
            throw insertError; // エラーがあればスロー
          }
        });

        await Promise.all(insertPromises); // 全ての挿入処理を待機
        console.log("All new data inserted successfully");
      }
    } catch (error) {
      console.error("Error updating, inserting, or deleting data:", error);
      return NextResponse.json(
        { error: "Failed to update ingredients" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}

// DELETEリクエストハンドラ
export async function DELETE(request: Request) {
  const { id, table } = await request.json();
  try {
    // dishes テーブルから指定された id を削除
    const { error } = await supabase.from(table).delete().eq("id", id);

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
