import { RecipeCalendar } from "@/components/recipe-calendar";
import { fetchFromApi } from "@/lib/fetch";
import { CalendarRecipe } from "@/types/calendar";

export default async function Page() {
  // /api/calendarsエンドポイントからデータを取得
  const data: CalendarRecipe[] = await fetchFromApi("/api/calendars", {
    cache: "no-store", // 最新データを取得したい場合
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
}
