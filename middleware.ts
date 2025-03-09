import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Cookieからトークンを取得
  const token = req.cookies.get("access_token")?.value;

  // トークンがない場合、ログインページにリダイレクト
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // トークンを検証してユーザー情報を取得
  const { data: { user }, error } = await supabase.auth.getUser(token);

  // トークンが無効な場合、ログインページにリダイレクト
  if (error || !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // トークンが有効な場合、次に進む
  return NextResponse.next();
}

export const config = {
  matcher: [
    // すべてのパスを対象にするが、
    // 下記の (?!...) の中で "login", "register", "api", "_next", "favicon.ico", ルート "/" を除外する
    "/((?!login|register|api|_next|favicon.ico|$).*)",
  ],
};
