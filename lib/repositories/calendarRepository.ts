import { supabase } from "@/lib/initSupabase";

export async function getCalendarByGroupId(groupId: number) {
  const { data, error } = await supabase
    .from("calendar_recipes")
    .select(
      `
      id,
      date,
      recipe_id,
      recipes:recipe_id (recipe_name, category)
    `
    )
    .eq("group_id", groupId)
    .order("date", { ascending: true });

  if (error) {
    throw new Error("Database error");
  }

  return data;
}
