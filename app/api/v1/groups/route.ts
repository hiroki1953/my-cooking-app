import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

export async function GET(req: NextRequest) {
  // ✅ 認証チェック（リクエストを渡す必要あり）
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

  // ✅ レスポンスを整形
  const response = data.map((group) => ({
    group_id: group.group_id,
    group_name: group.groups?.group_name || "Unknown",
  }));

  return NextResponse.json(response, { status: 200 });
}
