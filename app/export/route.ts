import { auth } from "@/auth";
import ical from "ical-generator";
import { getUserAttendances } from "@/app/lib/actions";
import { TICKS_IN_DAY } from "@/app/lib/constants";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) {
    console.log("User is not logged in");
    return new Response(null, {
      status: 401,
    });
  } else {
    const calendar = ical({ name: session.user?.name + "'s Timetable" });
    const attendances = await getUserAttendances();
    for (const att of attendances) {
      for (const sch of att.event.schedules)
        if (sch.id == att.scheduleId) {
          for (const session of sch.sessions) {
            const originStartTime =
              (((session.startTime.getTime() - session.startDate.getTime()) %
                TICKS_IN_DAY) +
                TICKS_IN_DAY) %
              TICKS_IN_DAY;
            const start = new Date(
              session.startDate.getTime() + originStartTime,
            );
            const end = new Date(session.endDate.getTime() + TICKS_IN_DAY);
            const duration =
              session.endTime.getTime() - session.startTime.getTime();
            let blockTime = start.getTime();
            for (
              blockTime;
              blockTime < end.getTime();
              blockTime += session.interval * TICKS_IN_DAY
            ) {
              calendar.createEvent({
                start: new Date(blockTime),
                end: new Date(blockTime + duration),
                summary: att.event.name,
                description: "",
                location: session.place,
                url: "",
              });
            }
          }
        }
    }
    const res = new Response(calendar.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="timetable.ics"',
      },
    });
    return res;
  }
}
