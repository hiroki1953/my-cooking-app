import { RecipeCalendar } from "@/components/recipe-calendar";
import { CalendarRecipe } from "@/types/calendar";

export default async function Page() {
  // /api/calendarsエンドポイントからデータを取得
  const res = await fetch("http://localhost:3000/api/calendars", {
    cache: "no-store", // 最新データを取得したい場合
  });

  // データの型をRecipeData[]として受け取る
  const data: CalendarRecipe[] = await res.json();

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
