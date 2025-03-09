"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { CategorySelect } from "./CategorySelect";
import { IngredientInput } from "./IngredientInput";
import { StepsInput } from "./StepInput";

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

interface RecipeFormProps {
  initialRecipe: Recipe;
  groupId: string;
}

export function RecipeForm({ initialRecipe, groupId }: RecipeFormProps) {
  const [name, setName] = useState(initialRecipe.recipe_name);
  const [category, setCategory] = useState(String(initialRecipe.category));
  const [ingredients, setIngredients] = useState(
    initialRecipe.recipe_ingredients.map((ri) => ({
      name: ri.ingredients.ingredient_name,
      quantity: ri.quantity,
      unit: ri.unit,
    }))
  );
  const [steps, setSteps] = useState(
    initialRecipe.steps.map((s) => ({
      description: s.step_description,
    }))
  );

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // PATCHリクエストで更新
      const res = await fetch(
        `/api/v1/groups/${groupId}/recipes?recipeId=${initialRecipe.recipe_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            category,
            ingredients,
            steps,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update recipe");
      }
      // 更新が成功したら、一覧や詳細へリダイレクトするなど
      router.back();
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>料理名</Label>
        <Input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="border rounded p-2 w-full"
          required
        />
      </div>

      {/* カテゴリー */}
      <CategorySelect
        category={category}
        onChange={(val) => setCategory(val)}
      />
      {/* 材料追加 */}
      <IngredientInput
        ingredients={ingredients}
        setIngredients={setIngredients}
      />

      {/* 手順 */}
      <StepsInput steps={steps} setSteps={setSteps} />

      {/* 送信ボタン */}
      <div className="flex justify-end gap-2">
        <Button type="submit" className="mt-4 bg-pink-500 text-white">
          更新
        </Button>
        <Button
          onClick={() => router.back()}
          type="button"
          className="mt-4 bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}
