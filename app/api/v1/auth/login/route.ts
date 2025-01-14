import { supabase } from "@/lib/initSupabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  console.log(email, password);

  // Supabaseのログイン処理
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
    });
  }

  // Cookieにアクセストークンを設定
  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set("access_token", data.session?.access_token || "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1日
  });

  return response;
}
