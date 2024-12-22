"use client";

import MealForm from "@/components/MealForm";
import { Dish } from "@/types/dish";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MealRegisterPage = () => {
  const router = useRouter();
  const { id } = useParams(); // 動的ルートのパラメータを取得

  const handleSave = async (dish: Dish) => {
    // Supabase APIを利用してデータを保存
    try {
      const response = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, dish }),
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

  const [mealData, setMealData] = useState<Dish[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/edit?id=${id}`); // APIを呼び出し
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to fetch meal data");
        }

        setMealData(json || null); // 必要なデータを設定
      } catch (error) {
        console.error("Error fetching meal data:", error);
        setMealData(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMealData();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <MealForm initialDish={mealData?.[0]} onSave={handleSave} />
    </div>
  );
};

export default MealRegisterPage;
