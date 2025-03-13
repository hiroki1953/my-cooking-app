import { supabase } from "@/lib/initSupabase";

export async function getRecipeByGroupId(groupId: number) {
  const { data, error } = await supabase
    .from("group_recipes")
    .select(
      `
        recipe_id,
        recipes:recipe_id (
          recipe_name
        )
      `
    )
    .eq("group_id", groupId);

  if (error) {
    throw new Error("Database error");
  }

  return data;
}

export async function getRecipeByRecipeId(recipeId: number) {
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      recipe_id,
      recipe_name,
      category,
      steps(
        step_id,
        step_num,
        step_description
      ),
      recipe_ingredients(
        quantity,
        unit,
        ingredient_id,
        ingredients:ingredient_id(
          ingredient_name
        )
      )
      `
    )
    .eq("recipe_id", recipeId);

  if (error) {
    throw new Error("Database error");
  }

  return data;
}

// ✅ レシピをINSERT (groupIdは使わない)
export async function insertRecipe(name: string, category: string) {
  const { data, error } = await supabase
    .from("recipes")
    .insert({
      recipe_name: name,
      category,
      // group_id を書かない
    })
    .select()
    .single(); // 1件だけ返す

  if (error) {
    throw new Error("Error inserting recipe: " + error.message);
  }

  return data; // 新しく作成されたレシピ行
}

// ✅ group_recipes に (group_id, recipe_id) をINSERT
export async function linkRecipeToGroup(groupId: number, recipeId: number) {
  const { error } = await supabase.from("group_recipes").insert({
    group_id: groupId,
    recipe_id: recipeId,
  });

  if (error) {
    throw new Error("Error inserting into group_recipes: " + error.message);
  }
}

/**
 * 食材リスト(ingredients配列)を処理して、
 * 1) ingredientsテーブルに食材名がなければ追加
 * 2) recipe_ingredientsテーブルに (recipe_id, ingredient_id, quantity, unit) をINSERT
 */
export async function insertIngredients(recipeId: number, ingredients: any[]) {
  // ingredients: [{ name, quantity, unit }, ...]

  for (const ing of ingredients) {
    // 1) 食材名が ingredients テーブルに存在するか確認
    const { data: found, error: findErr } = await supabase
      .from("ingredients")
      .select("ingredient_id")
      .eq("ingredient_name", ing.name)
      .maybeSingle();

    if (findErr) {
      throw new Error("Error checking ingredient: " + findErr.message);
    }

    let ingredientId: number;

    if (!found) {
      // 2) なければINSERT → 新規追加
      const { data: inserted, error: insertErr } = await supabase
        .from("ingredients")
        .insert({ ingredient_name: ing.name })
        .select() // 挿入した行を返す
        .single();

      if (insertErr) {
        throw new Error("Error inserting ingredient: " + insertErr.message);
      }
      // 新規作成した ingredient の id
      ingredientId = inserted.ingredient_id;
    } else {
      // すでに存在していれば、その id を使う
      ingredientId = found.ingredient_id;
    }

    // 3) recipe_ingredients テーブルに (recipe_id, ingredient_id, quantity, unit) を追加
    const { error: relErr } = await supabase.from("recipe_ingredients").insert({
      recipe_id: recipeId,
      ingredient_id: ingredientId,
      quantity: ing.quantity,
      unit: ing.unit,
    });

    if (relErr) {
      throw new Error("Error inserting recipe_ingredients: " + relErr.message);
    }
  }

  // 特に返すものがなければ空配列やメッセージでもOK
  return { message: "Ingredients inserted or updated successfully" };
}

export async function insertSteps(recipeId: number, steps: any[]) {
  // たとえば steps: [{ description }, ...]
  // 配列の順番に step_num を付与
  const records = steps.map((st, index) => ({
    recipe_id: recipeId,
    step_description: st.description,
    step_num: index + 1, // 1から始まるステップ番号
  }));

  const { data, error } = await supabase.from("steps").insert(records).select();

  if (error) {
    throw new Error("Error inserting steps: " + error.message);
  }

  return data;
}

// 1) recipe本体をUPDATE
export async function updateRecipeRow(
  recipeId: number,
  name: string,
  category: string
) {
  const { data, error } = await supabase
    .from("recipes")
    .update({ recipe_name: name, category })
    .eq("recipe_id", recipeId)
    .select()
    .single();
  if (error) throw new Error("Update recipe failed: " + error.message);
  return data;
}

export async function updateIngredient(name: string): Promise<number> {
  // 既存のingredient_nameを確認
  const { data, error } = await supabase
    .from("ingredients")
    .select("ingredient_id")
    .eq("ingredient_name", name)
    .single();

  // 存在しない場合は新規作成
  if (!data) {
    const { data: newIngredient, error: insertError } = await supabase
      .from("ingredients")
      .insert({ ingredient_name: name })
      .select("ingredient_id")
      .single();
    if (insertError)
      throw new Error("Insert new ingredient failed: " + insertError.message);

    return newIngredient.ingredient_id;
  } else if (error) {
    throw new Error("Fetch ingredient failed: " + error);
  }

  return data.ingredient_id;
}

// 2) ingredientsをUPDATE
//   - 例えば既存レコードをDELETEしてからINSERTし直すか、
//     or 1件ずつ差分更新するか、設計により異なる
export async function updateIngredients(recipeId: number, ingredients: any[]) {
  // シンプルに既存を消して全部入れ直す手法
  const { error: delError } = await supabase
    .from("recipe_ingredients")
    .delete()
    .eq("recipe_id", recipeId);
  if (delError)
    throw new Error("Delete old ingredients failed: " + delError.message);

  const updatedIngredients = await Promise.all(
    ingredients.map(async (ing) => {
      const ingredient_id = await updateIngredient(ing.name);
      return {
        recipe_id: recipeId,
        ingredient_id,
        quantity: ing.quantity,
        unit: ing.unit,
      };
    })
  );

  const { error: insError } = await supabase
    .from("recipe_ingredients")
    .insert(updatedIngredients);
  if (insError)
    throw new Error("Insert new ingredients failed: " + insError.message);
}

// 3) stepsをUPDATE
export async function updateSteps(recipeId: number, steps: any[]) {
  // 同様に旧レコード消して、新レコードを作り直すか、
  //   あるいは step_num の変更を考慮して1つずつUPDATEするか
  const { error: delError } = await supabase
    .from("steps")
    .delete()
    .eq("recipe_id", recipeId);
  if (delError) throw new Error("Delete old steps failed: " + delError.message);

  // 再INSERT
  const records = steps.map((step, index) => ({
    recipe_id: recipeId,
    step_description: step.description,
    step_num: index + 1,
  }));
  const { error: insError } = await supabase.from("steps").insert(records);
  if (insError) throw new Error("Insert new steps failed: " + insError.message);
}
