import { RecipeBadge } from "./recipe-badge";
import { DayRecipe, WEEKDAYS } from "../types/calendar";
import Link from "next/link";

interface WeekViewProps {
  currentDate: Date;
  recipes: DayRecipe[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export function WeekView({ currentDate, recipes }: WeekViewProps) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const getRecipesForDate = (date: Date) => {
    return (
      recipes.find(
        (r) =>
          r.date.getDate() === date.getDate() &&
          r.date.getMonth() === date.getMonth() &&
          r.date.getFullYear() === date.getFullYear()
      )?.recipes || []
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-pink-50">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`p-2 text-center font-medium ${
              index === 0 ? "text-rose-600" : index === 6 ? "text-blue-600" : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: 7 }).map((_, index) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + index);
          const dayRecipes = getRecipesForDate(date);
          const isToday =
            date.getDate() === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={index}
              className={`border-t border-r p-2 min-h-[120px] ${
                isToday ? "bg-pink-50" : ""
              }`}
            >
              <Link
                href={`/recipes/day/${date.toISOString()}`}
                className="block space-y-2"
              >
                <div
                  className={`text-sm font-medium ${
                    index === 0
                      ? "text-rose-600"
                      : index === 6
                      ? "text-blue-600"
                      : ""
                  }`}
                >
                  {date.getDate()}日
                </div>
                <div className="space-y-1">
                  {dayRecipes.map((recipe) => (
                    <RecipeBadge key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
