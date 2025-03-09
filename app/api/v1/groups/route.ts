import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  try{
    // リクエストからグループ名を取得
    const { group_name } = await req.json();

    // 認証情報をCookieから取得
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Supabaseでユーザー情報を取得
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // groupsテーブルに owner_id=user.id でINSERT
    const { data: group, error: insertErr } = await supabase
      .from("groups")
      .insert({
        group_name,
        owner_id: user.id, // ここにログインユーザーのIDをセット
      })
      .select()
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 400 });
    }

    if (!insertErr) {
      // group_members もINSERT
      await supabase
        .from("group_members")
        .insert({
          group_id: group.group_id,
          user_id: user.id,
        });
    }

    return NextResponse.json({ message: "Group created", group:group }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
