import { NextRequest, NextResponse } from "next/server";
import {
  addCalendarRecipe,
  fetchCalendar,
  removeCalendarRecipe,
} from "@/lib/services/calendarService";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ groupId?: string }> } // ✅ `params` を `Promise` として扱う
) {
  try {
    // ✅ `params` を `await` する
    const { groupId } = await context.params;
    if (!groupId) {
      return NextResponse.json(
        { error: "groupId is missing" },
        { status: 400 }
      );
    }

    const groupIdInt = parseInt(groupId, 10);
    if (isNaN(groupIdInt)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // ✅ クエリパラメータの取得
    const { searchParams } = req.nextUrl;
    const date = searchParams.get("date"); // 例: ?date=2025-02-28

    // カレンダー情報の取得
    const calendar = await fetchCalendar(groupIdInt, date);

    return NextResponse.json(calendar, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching calendar:", error.message);
    const status = error.message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ groupId?: string }> }
) {
  try {
    // paramsをawait
    const { groupId } = await context.params;
    if (!groupId) {
      return NextResponse.json(
        { error: "groupId is missing" },
        { status: 400 }
      );
    }

    const groupIdInt = parseInt(groupId, 10);
    if (isNaN(groupIdInt)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // リクエストボディをパース
    const body = await req.json();

    const { date, recipe_id } = body;

    // サービス層を呼んで処理
    const data = await addCalendarRecipe(groupIdInt, date, recipe_id);

    // 結果を返す
    return NextResponse.json(
      { message: "Inserted successfully", data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error inserting calendar recipe:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ groupId?: string }> }
) {
  try {
    // パスパラメータ
    const { groupId } = await context.params;
    if (!groupId) {
      return NextResponse.json(
        { error: "groupId is missing" },
        { status: 400 }
      );
    }

    const groupIdInt = parseInt(groupId, 10);
    if (isNaN(groupIdInt)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    // クエリパラメータ
    const { searchParams } = req.nextUrl;
    const date = searchParams.get("date"); // ?date=...

    // リクエストボディ
    const body = await req.json();
    const { id } = body; // 削除対象の dishId (recipe_id)

    if (!id) {
      return NextResponse.json(
        { error: "recipe_id (id) is missing" },
        { status: 400 }
      );
    }

    // サービス層で削除処理
    await removeCalendarRecipe(groupIdInt, date, id);

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting calendar recipe:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
