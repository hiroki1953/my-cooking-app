import { supabase } from "@/lib/initSupabase";
import { NextResponse } from "next/server";

export async function GET() {
  // calendarsテーブルのすべての日付とその料理情報を取得
  const { data, error } = await supabase.from("calendar").select(`
    id,
    date,
    dishes (
      id,
      name,
      category
    )
  `);

  if (!error && data) {
    // クライアント側でフィルタリング
    const filtered = data.filter(
      (item) => item.dishes && item.dishes.length > 0
    );
    return NextResponse.json(filtered, { status: 200 });
  }

  if (error) {
    console.error("Error fetching calendars data:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendars data" },
      { status: 500 }
    );
  }
}
