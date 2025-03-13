"use client";

import { useState, useEffect } from "react";
import { fetchFromApi } from "@/lib/fetch";
import { Dish } from "@/types/dish";

export function useMealData(
  groupId: string | undefined,
  date: string | undefined
) {
  const [mealData, setMealData] = useState<Dish[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setError("グループIDが取得できません");
      setLoading(false);
      return;
    }

    if (!date) {
      setError("日付が指定されていません");
      setLoading(false);
      return;
    }

    const fetchMealData = async () => {
      setLoading(true);
      try {
        const json = await fetchFromApi(
          `/api/v1/groups/${groupId}/calendar?date=${date}`
        );
        if (json.length === 0) {
          setMealData([]);
          return;
        }
        setMealData(json[0].dishes || null);
      } catch (err) {
        console.error("食事データの取得エラー:", err);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchMealData();
  }, [groupId, date]);

  const deleteDish = async (dishId: number) => {
    try {
      await fetchFromApi(`/api/v1/groups/${groupId}/calendar?date=${date}`, {
        method: "DELETE",
        body: JSON.stringify({ id: dishId }), // recipe_id
      });
      alert("削除しました");
      window.location.reload();
    } catch (err) {
      console.error("削除エラー:", err);
      alert("削除に失敗しました");
    }
  };

  return { mealData, loading, error, deleteDish };
}
