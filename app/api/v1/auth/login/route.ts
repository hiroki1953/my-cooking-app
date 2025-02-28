import { NextResponse } from "next/server";
import { loginUser } from "@/lib/services/authService";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const { user, groups } = await loginUser(email, password);

    // Cookieにアクセストークンを設定
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        groups,
      },
    });

    response.cookies.set("access_token", user.session?.access_token || "", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1日
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
