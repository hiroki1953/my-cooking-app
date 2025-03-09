"use client";

import { useState, useEffect } from "react";
import { fetchFromApi } from "@/lib/fetch";

export function useFetchRecipes(groupId: string | null) {
  const [initialRecipes, setInitialRecipes] = useState<
    { date: Date; recipes: string[] }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      try {
        const data = await fetchFromApi(`/api/v1/groups/${groupId}/calendar`, {
          cache: "no-store",
        });

        const formattedRecipes = data.map((item: any) => ({
          date: new Date(item.date),
          recipes: item.dishes, // APIの `dishes` を使用
        }));

        setInitialRecipes(formattedRecipes);
      } catch (error) {
        console.error("カレンダーデータの取得エラー:", error);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  return { initialRecipes, loading, error };
}
