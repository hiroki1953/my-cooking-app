"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchFromApi } from "@/lib/fetch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { StepsInput } from "./StepInput";
import { IngredientInput } from "./IngredientInput";
import { CategorySelect } from "./CategorySelect";

// 既存メニュー一覧の型（イメージ）
type Recipe = {
  recipe_id: number;
  recipes: { recipe_name: string };
};

interface IngredientType {
  name: string;
  quantity: string;
  unit: string;
}

interface Step {
  description: string;
}

interface MultiStepAddMealModalProps {
  date: string;
  groupId: string;
  onClose: () => void; // モーダルを閉じるためのコールバック
  onSuccess: () => void; // 追加成功したら呼ばれる
}

export function MultiStepAddMealModal({
  date,
  groupId,
  onClose,
  onSuccess,
}: MultiStepAddMealModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // step=1: 選択画面, step=2: 既存メニュー選択, step=3: 新規フォーム
  const [category, setCategory] = useState(""); // 初期は "" など
  const [ingredients, setIngredients] = useState<IngredientType[]>([
    { name: "", quantity: "", unit: "" },
  ]);
  const [steps, setSteps] = useState<Step[]>([{ description: "" }]);

  // 既存メニュー一覧を取得
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  useEffect(() => {
    // step=2 のタイミングで取得してもOKだが、ここでは先読みしておく
    fetchFromApi(`/api/v1/groups/${groupId}/recipes`)
      .then((res) => setRecipes(res))
      .catch(console.error);
  }, [groupId]);

  // -------------------------------------------
  // Step 2: 既存メニューを日付に紐づける関数
  // -------------------------------------------
  const handleSelectExisting = async (recipeId: number) => {
    try {
      // calendar_recipes に (groupId, date, recipeId) をINSERTする想定
      await fetchFromApi(`/api/v1/groups/${groupId}/calendar`, {
        method: "POST",
        body: JSON.stringify({ date, recipe_id: recipeId }),
      });
      // 成功後、閉じる & 親に成功を通知
      onSuccess();
      onClose();
    } catch (err) {
      console.error("既存メニュー追加エラー:", err);
    }
  };

  // -------------------------------------------
  // Step 3: 新規メニューを登録し、日付に紐づける関数
  // -------------------------------------------
  const handleNewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const category = formData.get("category");
    const ingredientsRaw = formData.get("ingredients") as string | null;
    const parsedIngredients = ingredientsRaw ? JSON.parse(ingredientsRaw) : [];
    const stepsRaw = formData.get("steps") as string | null;
    const parsedSteps = stepsRaw ? JSON.parse(stepsRaw) : [];

    // ... 他にも材料などを取得・構築して送る

    try {
      // 1. レシピを作成
      const newRecipe = await fetchFromApi(
        `/api/v1/groups/${groupId}/recipes`,
        {
          method: "POST",
          body: JSON.stringify({
            name,
            category,
            parsedIngredients,
            parsedSteps,
          }),
        }
      );

      // 2. 作成したレシピを date に紐づけ
      await fetchFromApi(`/api/v1/groups/${groupId}/calendar`, {
        method: "POST",
        body: JSON.stringify({ date, recipe_id: newRecipe.data.recipe_id }),
      });
      // 成功後、閉じる & 親に成功を通知
      onSuccess();
      onClose();
    } catch (err) {
      console.error("新規メニュー追加エラー:", err);
    }
  };

  // -------------------------------------------
  // UI: step に応じて表示切り替え
  // -------------------------------------------
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        {step === 1 && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>料理を追加</DialogTitle>
            </DialogHeader>
            <p>
              既存のメニューを追加するか、新しくメニューを作成するか選択してください。
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => setStep(3)}
                className="bg-pink-500 text-white hover:bg-pink-600"
              >
                新規メニューを作成
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
              >
                既存メニューから選ぶ
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>既存メニュー一覧</DialogTitle>
            </DialogHeader>
            <ul>
              {recipes.map((r) => (
                <li
                  key={r.recipe_id}
                  className="flex justify-between items-center py-1"
                >
                  <span>{r.recipes.recipe_name}</span>
                  <Button
                    onClick={() => handleSelectExisting(r.recipe_id)}
                    className="bg-pink-500 text-white hover:bg-pink-600"
                  >
                    追加
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="mt-4 bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
                onClick={() => setStep(1)}
              >
                戻る
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>新規メニュー作成</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNewSubmit} className="space-y-4">
              {/* 料理名 */}
              <div className="space-y-2">
                <Label>料理名</Label>
                <Input
                  name="name"
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
              {/* 材料 / 作り方など追加したい場合はここでフォームを増やす */}
            </form>
            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                className="mt-4 bg-pink-500 text-white hover:bg-pink-600"
              >
                登録
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="mt-4 bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
              >
                戻る
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
