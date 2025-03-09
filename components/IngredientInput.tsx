"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";
import React from "react";

// 親から受け取る型
interface IngredientType {
  name: string;
  quantity: string;
  unit: string;
}

interface IngredientInputProps {
  ingredients: IngredientType[];
  setIngredients: React.Dispatch<React.SetStateAction<IngredientType[]>>;
}

// ユーザーがもともと書いていたローカル state を、props に置き換えた形
export function IngredientInput({
  ingredients,
  setIngredients,
}: IngredientInputProps) {
  const UNIT_OPTIONS = [
    "g",
    "kg",
    "ml",
    "L",
    "個",
    "枚",
    "本",
    "玉",
    "束",
    "パック",
    "大さじ",
    "小さじ",
    "カップ",
    "適量",
  ];

  // 材料を追加
  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", quantity: "", unit: "" }]);
  };

  // 材料を削除
  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // 入力変更
  const handleChange = (
    index: number,
    field: keyof IngredientType,
    value: string
  ) => {
    setIngredients((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>材料</Label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="mt-2 space-y-2">
            {/* 1行目: 材料名 */}
            <div className="flex gap-2">
              <Input
                name={`ingredient_${index}`}
                value={ingredient.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="材料名"
                className="flex-1"
              />
            </div>

            {/* 2行目: 分量 + 単位 + 削除ボタン */}
            <div className="flex gap-2">
              <Input
                name={`quantity_${index}`}
                value={ingredient.quantity}
                onChange={(e) =>
                  handleChange(index, "quantity", e.target.value)
                }
                placeholder="分量"
              />

              <Select
                value={ingredient.unit}
                onValueChange={(val) => handleChange(index, "unit", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="単位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {UNIT_OPTIONS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={() => removeIngredient(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ボタン: 材料を追加 */}
      <Button
        size="sm"
        type="button"
        variant="outline"
        onClick={addIngredient}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        材料を追加
      </Button>

      {/*
        hidden inputに ingredients をJSON文字列化して入れる。
        親がこれを FormData で受け取れる。
      */}
      <input
        type="hidden"
        name="ingredients"
        value={JSON.stringify(ingredients)}
      />
    </div>
  );
}
