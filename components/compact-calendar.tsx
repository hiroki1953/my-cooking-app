import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEEKDAYS, DayRecipe } from "../types/calendar";

interface CompactCalendarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  recipes: DayRecipe[];
}

export function CompactCalendar({
  currentDate,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
  recipes,
}: CompactCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const hasRecipes = (date: Date) => {
    return recipes.some(
      (r) =>
        r.date.getDate() === date.getDate() &&
        r.date.getMonth() === date.getMonth() &&
        r.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={onPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
        </h2>
        <Button variant="outline" size="icon" onClick={onNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium ${
              index === 0 ? "text-rose-600" : index === 6 ? "text-blue-600" : ""
            }`}
          >
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayWeekday }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            index + 1
          );
          const isSelected =
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
          const isToday =
            date.getDate() === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear();
          const hasRecipesForDate = hasRecipes(date);

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`
                ${isSelected ? "bg-pink-200 text-pink-900" : ""}
                ${isToday ? "border border-pink-500" : ""}
                ${hasRecipesForDate ? "bg-pink-100 hover:bg-pink-200" : ""}
              `}
              onClick={() => handleDateClick(date)}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
