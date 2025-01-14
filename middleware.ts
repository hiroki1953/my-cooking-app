import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./lib/initSupabase";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl; // リクエストされたパス

  // 除外するパスを明示的に指定
  const excludedPaths = ["/login", "/api/auth/login", "/register"];
  if (excludedPaths.includes(pathname)) {
    return NextResponse.next(); // ミドルウェアの処理をスキップ
  }

  // Cookieからトークンを取得
  const token = req.cookies.get("access_token")?.value;

  // トークンがない場合、ログインページにリダイレクト
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // トークンを検証してユーザー情報を取得
  const { data: user, error } = await supabase.auth.getUser(token);

  // トークンが無効な場合、ログインページにリダイレクト
  if (error || !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // トークンが有効な場合、リクエストを次に進める
  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: ["/"],
};
