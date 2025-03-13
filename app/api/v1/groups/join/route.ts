// app/api/v1/groups/join/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json(
        { error: "Invitation code is required" },
        { status: 400 }
      );
    }
    // token 認証
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const {
      data: { user },
    } = await supabase.auth.getUser(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. invitationsテーブルで code を検索
    const { data: invitation, error: invErr } = await supabase
      .from("invitations")
      .select("*")
      .eq("invitation_code", code)
      .single();
    if (invErr || !invitation) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // 2. 期限や status を確認
    if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Invitation expired" },
        { status: 400 }
      );
    }
    if (invitation.status !== "active") {
      return NextResponse.json(
        { error: "Invitation not active" },
        { status: 400 }
      );
    }

    // 3. group_membersに { group_id: invitation.group_id, user_id: user.id }追加
    // role='MEMBER'など
    const { error: gmErr } = await supabase.from("group_members").insert({
      group_id: invitation.group_id,
      user_id: user.id,
    });
    if (gmErr) {
      return NextResponse.json({ error: gmErr.message }, { status: 400 });
    }

    // 4. invitationsテーブルを usedに更新
    await supabase
      .from("invitations")
      .update({ status: "used", used_at: new Date().toISOString() })
      .eq("id", invitation.id);

    // 招待成功、 group_idを返す
    return NextResponse.json({
      message: "Joined group successfully",
      group_id: invitation.group_id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
