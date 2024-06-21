import { auth } from "@/auth";
import ical, { ICalCalendarMethod } from "ical-generator";
import { getUserAttendances } from "@/app/lib/actions";
import { TICKS_IN_DAY } from "@/app/lib/constants";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const params = req.nextUrl.searchParams;
  url.searchParams.append("query", "WHAT ARE YOU DOING");
  url.pathname = "asd";
  const res = new Response(new Date().toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="timetable.ics"',
    },
  });
  return res;
}
