import { supabase } from "@/lib/initSupabase";

export async function getUserGroups(userId: string) {
  const { data, error } = await supabase
    .from("group_members")
    .select("group_id, groups (group_name)")
    .eq("user_id", userId);

  if (error) {
    throw new Error("Database error");
  }

  return data.map((group) => ({
    group_id: group.group_id,
    group_name: group.groups?.group_name || null,
  }));
}
