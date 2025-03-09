"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

/** 親から受け取るPropsの型定義 */
interface CategorySelectProps {
  category: string; // 選択されているカテゴリーの値
  onChange: (val: string) => void; // カテゴリーが変わったときに呼ぶコールバック
}

export function CategorySelect({ category, onChange }: CategorySelectProps) {
  return (
    <div>
      <Label>カテゴリー</Label>
      <Select
        // 親からもらったcategoryを表示
        value={category}
        // onValueChangeで親のonChangeを呼ぶ
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="カテゴリーを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="1">和食</SelectItem>
            <SelectItem value="2">中華</SelectItem>
            <SelectItem value="3">洋食</SelectItem>
            <SelectItem value="4">その他</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/*
        hidden inputを置くことで、
        通常のフォーム送信時に name="category" の項目が含まれるようになる
      */}
      <input type="hidden" name="category" value={category} />
    </div>
  );
}
