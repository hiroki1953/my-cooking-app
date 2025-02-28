import { NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";
import { fetchUserGroups } from "@/lib/services/groupService";

export async function GET() {
  try {
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
    const groups = await fetchUserGroups(user.id);

    return NextResponse.json(groups, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching groups:", error.message);
    const status = error.message === "No groups found" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
