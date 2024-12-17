"use client";

import MealForm from "@/components/MealForm";
import { useParams, useRouter } from "next/navigation";

type Dish = {
  id: number;
  name: string;
  description: string;
  category: string;
  ingredients: {
    id: number;
    name: string;
    unit: string;
  }[];
  steps: {
    id: number;
    step: string;
    description: string;
  }[];
};

const MealRegisterPage = () => {
  const router = useRouter();
  const { data } = useParams(); // 動的ルートのパラメータを取得

  const handleSave = async (dish: Dish) => {
    // Supabase APIを利用してデータを保存
    try {
      const response = await fetch("/api/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: data, dish }),
      });
      if (!response.ok) {
        throw new Error("Error saving data");
      }

      // 成功した場合はカレンダーに戻る
      router.push("/");
    } catch (error) {
      console.error("Failed to save meal:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <MealForm initialDish="" onSave={handleSave} />
    </div>
  );
};

export default MealRegisterPage;
