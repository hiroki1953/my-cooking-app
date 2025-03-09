import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";
import { randomBytes } from "crypto";  // Node.jsでランダム文字列生成など

export async function POST(req: NextRequest, context: { params: { groupId?: string } }) {
  try {
    // 1) groupIdの取得
    const { groupId } = context.params;
    if (!groupId) {
      return NextResponse.json({ error: "groupId is missing" }, { status: 400 });
    }

    // 2) 認証チェック
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3) グループのowner_idかmembersに所属しているかを確認 (オプション)
    // 必要があれば group_membersテーブルで user_id===user.id && group_id===groupId を検索
    // role==='OWNER' or 'ADMIN' だけが発行可能などルールを定める

    // 4) 招待コードを生成
    // 例: 8文字のランダム英数字
    const codeBuffer = randomBytes(4);
    const invitationCode = codeBuffer.toString("hex"); // 8桁

    // 5) invitationsテーブルにINSERT
    const { data, error: insertErr } = await supabase
      .from("invitations")
      .insert({
        group_id: groupId,
        invitation_code: invitationCode,
        status: "active",
        invited_by: user.id,
        // expires_at: new Date(Date.now() + 1000*60*60*24) // 24時間後など
      })
      .select()
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 400 });
    }

    // 6) 招待コードを返す
    return NextResponse.json({
      message: "Invitation created",
      invitation_code: invitationCode,
      invitation_id: data.id,
      group_id: data.group_id,
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
