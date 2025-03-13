import { supabase } from "@/lib/initSupabase";
import { Tables } from "@/types/supabase";

// `group_members` の型を適用
export async function getUserGroups(
  userId: string
): Promise<{ group_id: number; group_name: string | null }[]> {
  const { data, error } = await supabase
    .from("group_members")
    .select("group_id, groups (group_name)")
    .eq("user_id", userId)
    .returns<Tables<"group_members">[]>(); // 🔵 ここで型を適用

  if (error || !data) {
    throw new Error("Database error");
  }

  return data.map((group) => ({
    group_id: group.group_id,
    group_name: (group as any).groups?.group_name || null, // `groups` を `any` で回避する方法も可
  }));
}
