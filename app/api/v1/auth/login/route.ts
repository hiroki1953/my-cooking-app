import { NextResponse } from "next/server";
import { loginUser } from "@/lib/services/authService";
import { LoginRequest } from "@/types/auth";

export async function POST(req: Request) {
  try {
    // リクエストボディの型を適用
    const body: LoginRequest = await req.json();
    const { email, password } = body;

    const { user, groups, access_token } = await loginUser(email, password);

    // Cookieにアクセストークンを設定
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        groups,
      },
    });

    response.cookies.set("access_token", access_token || "", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 2週間
    });

    return response;
  } catch (error) {
    // エラーの型を `unknown` にして、型チェック後に `message` を取得
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 401 }
    );
  }
}
