import { supabase } from "@/lib/initSupabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Supabaseのログイン処理
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (loginError) {
    return new Response(JSON.stringify({ error: loginError.message }), {
      status: 401,
    });
  }

  const user = loginData.user;
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 401,
    });
  }

  // ユーザーの所属グループを取得
  const { data: groupData, error: groupError } = await supabase
    .from("group_members")
    .select("group_id, groups (group_name)")
    .eq("user_id", user.id);

  if (groupError) {
    console.error("Database error:", groupError);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }

  // Cookieにアクセストークンを設定
  const response = NextResponse.json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      groups: groupData.map((group) => ({
        group_id: group.group_id,
        group_name: group.groups?.group_name || null,
      })),
    },
  });

  response.cookies.set("access_token", loginData.session?.access_token || "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1日
  });

  return response;
}
