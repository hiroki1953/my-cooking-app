import { Recipe } from "../types/calendar";

interface RecipeBadgeProps {
  recipe: Recipe;
}

export function RecipeBadge({ recipe }: RecipeBadgeProps) {
  let className = "inline-block px-2 py-1 rounded-md text-sm";
  let categoryName = "";

  // 条件分岐でクラスを割り当てる
  if (recipe.category === "1") {
    className += " bg-rose-100 text-rose-900";
    categoryName = "和食";
  } else if (recipe.category === "2") {
    className += " bg-amber-100 text-amber-900";
    categoryName = "中華";
  } else if (recipe.category === "3") {
    className += " bg-blue-100 text-blue-900";
    categoryName = "洋食";
  } else if (recipe.category === "4") {
    className += " bg-purple-100 text-purple-900";
    categoryName = "未分類";
  } else {
    // 万が一、該当しない場合はデフォルトクラス
    className += " bg-gray-200 text-gray-800";
  }

  return <span className={className}>{categoryName}</span>;
}
