"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RecipeForm } from "@/components/RecipeForm";
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

export default function Page() {
  const { groupId, recipeId } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // クライアントサイドでデータをフェッチ
  useEffect(() => {
    if (!groupId || !recipeId) return; // パラメータが取れない場合は何もしない

    setLoading(true);
    fetchFromApi(`/api/v1/groups/${groupId}/recipes?recipeId=${recipeId}`)
      .then((data) => {
        setRecipe(data || null);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setRecipe(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [groupId, recipeId]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!recipe) {
    return <div>レシピが見つかりませんでした</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">レシピ編集</h1>
      <RecipeForm initialRecipe={recipe} groupId={groupId as string} />
    </div>
  );
}
