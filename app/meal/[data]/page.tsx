"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

export default function MealDetailPage() {
  const { data } = useParams(); // 動的ルートのパラメータを取得
  const router = useRouter(); // router インスタンスを取得

  const [mealData, setMealData] = useState<Dish[] | null>(null);
  const [loading, setLoading] = useState(true);

  const categoryMap: { [key: string]: string } = {
    4: "その他",
    1: "和食",
    2: "中華",
    3: "洋食",
  };

  const deleteDish = async (dishId: number) => {
    try {
      const response = await fetch(`/api/meal`, {
        method: "DELETE",
        body: JSON.stringify({ id: dishId }),
      });

      if (response.ok) {
        window.location.reload();
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting dish:", errorData);
        alert("削除に失敗しました");
        return;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("予期しないエラーが発生しました");
    }
  };

  useEffect(() => {
    const fetchMealData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/meal?date=${data}`); // APIを呼び出し
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

    if (data) {
      fetchMealData();
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!mealData || mealData.length === 0) {
    return (
      <>
        <div>この日に料理は登録されていません</div>
        <div className="mt-4">
          <button
            onClick={() => router.push(`/meal/${data}/register`)} // カレンダーに戻るボタン
            className="px-4 py-2 mr-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
          >
            データを登録する
          </button>
          <button
            onClick={() => router.push("/")} // カレンダーに戻るボタン
            className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
          >
            カレンダーに戻る
          </button>
        </div>
      </>
    );
  }

  return (
    <div className=" to-white min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Recipe Header */}
        {mealData.map((dish) => (
          <Card key={dish.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-bold">{dish.name}</h2>
              <div className="flex items-center gap-2"></div>
              <p className="text-sm text-muted-foreground">
                {dish.description}
              </p>
              <Separator />

              <div>
                <h3 className="font-bold mb-2">カテゴリー</h3>
                <div className="space-y-2">
                  {categoryMap[dish.category] || "未設定"}
                </div>
              </div>
              <Separator />

              <div>
                <h3 className="font-bold mb-2">材料</h3>
                <div className="space-y-2">
                  {dish.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm border-dotted border-b-2"
                    >
                      <span>{ingredient.name}</span>
                      <span>{ingredient.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="font-bold mb-2">作り方</h3>
                {dish.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* button */}
              <div className="pt-4 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-sm"
                    onClick={() => router.push(`/meal/${data}/${dish.id}`)} // カレンダーに戻るボタン
                  >
                    編集する
                  </Button>
                  <Button
                    variant="destructive"
                    className="text-sm"
                    onClick={() => deleteDish(dish.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/meal/${data}/register`)} // カレンダーに戻るボタン
            className="bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
          >
            料理を追加する
          </Button>
          <Button
            onClick={() => router.push("/")} // カレンダーに戻るボタン
            className="bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
          >
            カレンダーに戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
