"use client";

import { useState } from "react";
import { CompactCalendar } from "./compact-calendar";
import { RecipeDetails } from "./recipe-details";
import { DayRecipe } from "../types/calendar";
import { useGroupId } from "@/hooks/useGroupId";

interface RecipeCalendarProps {
  initialRecipes: DayRecipe[];
}

export function RecipeCalendar({ initialRecipes }: RecipeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [recipes] = useState(initialRecipes);
  const { groupId, error } = useGroupId(); // ✅ グループIDを取得
  if (error) {
    return <p className="text-red-500">グループ情報を取得できませんでした。</p>;
  }

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2">
        <CompactCalendar
          currentDate={currentDate}
          onDateSelect={handleDateSelect}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          recipes={recipes}
        />
      </div>
      <div className="w-full md:w-1/2">
        <RecipeDetails
          selectedDate={selectedDate}
          recipes={recipes}
          groupId={groupId}
        />
      </div>
    </div>
  );
}
