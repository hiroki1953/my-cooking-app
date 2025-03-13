import { NextRequest, NextResponse } from "next/server";
import {
  fetchRecipe,
  createRecipe,
  updateRecipe,
  fetchRecipeById,
} from "@/lib/services/recipeService";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ groupId?: string }> }
) {
  try {
    // paramsをawaitして、groupIdとrecipeIdを取得
    const { groupId } = await context.params;
    const recipeId = req.nextUrl.searchParams.get("recipeId");

    if (!groupId) {
      return NextResponse.json(
        { error: "groupId is missing" },
        { status: 400 }
      );
    }
    const groupIdInt = parseInt(groupId, 10);
    if (isNaN(groupIdInt)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // recipeIdが渡されていれば、特定のレシピ情報のみ取得
    if (recipeId) {
      const recipeIdInt = parseInt(recipeId, 10);
      if (isNaN(recipeIdInt)) {
        return NextResponse.json(
          { error: "Invalid recipe ID" },
          { status: 400 }
        );
      }
      const recipe = await fetchRecipeById(recipeIdInt);

      if (!recipe) {
        return NextResponse.json(
          { error: "Recipe not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(recipe, { status: 200 });
    } else {
      // recipeIdがない場合は、グループ全体のレシピ情報を取得
      const recipes = await fetchRecipe(groupIdInt);
      return NextResponse.json(recipes, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error fetching recipes:", error.message);
    const status = error.message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

// ✅ 新規レシピ登録 (POST)
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ groupId?: string }> }
) {
  try {
    // パスパラメータをawait
    const { groupId } = await context.params;
    if (!groupId) {
      return NextResponse.json(
        { error: "groupId is missing" },
        { status: 400 }
      );
    }

    const groupIdInt = parseInt(groupId, 10);
    if (isNaN(groupIdInt)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // リクエストボディをパース
    const body = await req.json();
    const { name, category, parsedIngredients, parsedSteps } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Recipe name is required" },
        { status: 400 }
      );
    }

    // サービス層でレシピ作成処理を実行
    const newRecipe = await createRecipe(
      groupIdInt,
      name,
      category,
      parsedIngredients,
      parsedSteps
    );

    // 作成したレシピデータを返す
    return NextResponse.json(
      { message: "Recipe created", data: newRecipe },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating recipe:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ groupId?: string }> }
) {
  try {
    // パスパラメータをawait
    const { groupId } = await context.params;
    if (!groupId) {
      return NextResponse.json(
        { error: "groupId is missing" },
        { status: 400 }
      );
    }

    const groupIdInt = parseInt(groupId, 10);
    if (isNaN(groupIdInt)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }
    const recipeId = req.nextUrl.searchParams.get("recipeId");
    if (!recipeId) {
      return NextResponse.json(
        { error: "recipeId is missing" },
        { status: 400 }
      );
    }
    const recipeIdInt = parseInt(recipeId, 10);
    if (isNaN(recipeIdInt)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    const body = await req.json(); // { name, category, ingredients, steps... }

    // サービス層で更新
    const updated = await updateRecipe(recipeIdInt, body);

    return NextResponse.json(
      { message: "Recipe updated", data: updated },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
