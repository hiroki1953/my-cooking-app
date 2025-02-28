import { RecipeCalendar } from "@/components/recipe-calendar";
import { fetchFromApi } from "@/lib/fetch";

export default async function Page({
  params,
}: {
  params: { groupId?: string };
}) {
  // groupId を安全に取得
  if (!params?.groupId) {
    return (
      <div className="text-center text-red-500">グループIDが見つかりません</div>
    );
  }

  const groupId = params.groupId;

  try {
    // サーバーでデータを取得
    const data = await fetchFromApi(`/api/v1/groups/${groupId}/calendar`, {
      cache: "no-store", // 最新データを取得
    });

    // 受け取ったdataからinitialRecipes配列を生成
    const initialRecipes = data.map((item) => ({
      date: new Date(item.date),
      recipes: item.dishes, // APIで`dishes`になっていると仮定
    }));

    return (
      <div className="container mx-auto py-8">
        <RecipeCalendar initialRecipes={initialRecipes} />
      </div>
    );
  } catch (error) {
    console.error("カレンダーデータの取得エラー:", error);
    return (
      <div className="text-center text-red-500">データの取得に失敗しました</div>
    );
  }
}
