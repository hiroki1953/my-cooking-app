"use client";

import MealForm from "@/components/MealForm";
import { fetchFromApi } from "@/lib/fetch";
import { Dish } from "@/types/dish";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MealRegisterPage = () => {
  const router = useRouter();
  const { id } = useParams(); // 動的ルートのパラメータを取得

  const handleSave = async (dish: Dish) => {
    // Supabase APIを利用してデータを保存
    try {
      const response = await fetchFromApi("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, dish }),
      });

      if (response.status == 200) {
        // 成功した場合はカレンダーに戻る
        router.push("/");
      }
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
        const json = await fetchFromApi(`/api/edit?id=${id}`); // APIを呼び出し

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
