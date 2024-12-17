"use client";

import { useState } from "react";
import { CompactCalendar } from "./compact-calendar";
import { RecipeDetails } from "./recipe-details";
import { DayRecipe } from "../types/calendar";

interface RecipeCalendarProps {
  initialRecipes: DayRecipe[];
}

export function RecipeCalendar({ initialRecipes }: RecipeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [recipes] = useState(initialRecipes);

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
        <RecipeDetails selectedDate={selectedDate} recipes={recipes} />
      </div>
    </div>
  );
}
