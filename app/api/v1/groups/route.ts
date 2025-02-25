import { NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

// ✅ `group_members` の型を定義
type GroupMember = {
  group_id: number;
  group_name: string;
};

export async function GET() {
  // ✅ 認証チェック
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized access." },
      { status: 401 }
    );
  }

  // ✅ ユーザーの所属グループを取得
  const { data, error: dbError } = await supabase
    .from("group_members")
    .select(
      `
      group_id,
      groups (group_name)
    `
    )
    .eq("user_id", user.id);

  if (dbError) {
    console.error("Database error:", dbError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "No groups found." }, { status: 404 });
  }

  // ✅ `GroupMember` 型を適用
  const response: GroupMember[] = data.map((group) => ({
    group_id: group.group_id,
    group_name: group.groups[0]?.group_name || null,
  }));

  return NextResponse.json(response, { status: 200 });
}
