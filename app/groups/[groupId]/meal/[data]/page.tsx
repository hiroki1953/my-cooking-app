"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMealData } from "@/hooks/useMealData";
import { MultiStepAddMealModal } from "@/components/MultiStepAddMealModal";

export default function MealDetailPage() {
  const router = useRouter();
  const { groupId, data } = useParams() as { groupId?: string; data?: string };
  const { mealData, loading, error, deleteDish } = useMealData(groupId, data);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleSuccess = () => {
    window.location.reload();
  };

  const categoryMap: { [key: string]: string } = {
    4: "その他",
    1: "和食",
    2: "中華",
    3: "洋食",
  };

  if (loading) {
    return <div>データを読み込み中...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  let content = null;
  if (!mealData || mealData.length === 0) {
    content = (
      <div className="text-center">
        <p>この日に料理は登録されていません</p>
        <div className="mt-4 flex gap-2 justify-center">
          {/* 料理を追加する: ピンク */}
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-500 text-white hover:bg-pink-600"
          >
            料理を追加する
          </Button>

          {/* カレンダーに戻る: 白 */}
          <Button
            onClick={() => router.push(`/groups/${groupId}/calendar`)}
            className="bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
          >
            カレンダーに戻る
          </Button>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="max-w-2xl mx-auto space-y-6">
        {mealData.map((dish) => (
          <Card key={dish.id}>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-bold">{dish.name}</h2>
              <Separator />

              <div>
                <h3 className="font-bold mb-2">カテゴリー</h3>
                <p>{categoryMap[dish.category] || "未設定"}</p>
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
                      <span>{ingredient.ingredients.ingredient_name}</span>
                      <span>
                        {ingredient.quantity}
                        {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />

              <div>
                <h3 className="font-bold mb-2">作り方</h3>
                {dish.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm">{step.step_description}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`edit/${dish.id}`)}
                >
                  編集する
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteDish(dish.id)}
                >
                  削除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-2 justify-center">
          {/* 料理を追加する: ピンク */}
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-500 text-white hover:bg-pink-600"
          >
            料理を追加する
          </Button>

          {/* カレンダーに戻る: 白 */}
          <Button
            onClick={() => router.push(`/groups/${groupId}/calendar`)}
            className="bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
          >
            カレンダーに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {content}

      {/* モーダルを共通で描画しておけば、showAddModal が true のときに表示される */}
      {showAddModal && (
        <MultiStepAddMealModal
          date={data!}
          groupId={groupId!}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
