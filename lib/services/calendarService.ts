import { getCalendarByGroupId } from "@/lib/repositories/calendarRepository";
import { log } from "console";

type CalendarRecipe = {
  id: number;
  date: string | null;
  recipe_id: number | null;
  recipe_name: string | null;
  recipe_category: number | null;
};

export async function fetchCalendar(groupId: number): Promise<CalendarRecipe[]> {
  const data = await getCalendarByGroupId(groupId);

  if (!data || data.length === 0) {
    throw new Error("Group not found or no calendar entries");
  }

  const calendarMap: { [key: string]: CalendarRecipe } = {};

  data.forEach((entry) => {
    const date = entry.date;
    const dish = {
      id: entry.recipe_id,
      name: entry.recipes?.recipe_name || null,
      category: entry.recipes?.category || null,
    };

    if (calendarMap[date]) {
      calendarMap[date].dishes.push(dish);
    } else {
      calendarMap[date] = {
        id: entry.id,
        date: date,
        dishes: [dish],
      };
    }
  });

  return Object.values(calendarMap);
}
