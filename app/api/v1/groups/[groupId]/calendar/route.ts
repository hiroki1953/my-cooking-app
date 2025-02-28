import { NextRequest, NextResponse } from "next/server";
import { fetchCalendar } from "@/lib/services/calendarService";

export async function GET(
  req: NextRequest,
  context: { params: { groupId?: string } }
) {
  try {

    if (!context.params?.groupId) {
      return NextResponse.json({ error: "groupId is missing" }, { status: 400 });
    }

    const groupId = parseInt(context.params.groupId, 10);
    if (isNaN(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    const calendar = await fetchCalendar(groupId);

    return NextResponse.json(calendar, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching calendar:", error.message);
    const status = error.message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
