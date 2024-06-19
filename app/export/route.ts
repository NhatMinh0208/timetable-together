import { auth } from "@/auth";
import ical, { ICalCalendarMethod } from "ical-generator";
import { Session } from "next-auth";
import { getUserAttendances } from "../lib/actions";
import { TICKS_IN_DAY } from "../lib/constants";

const calendar = ical({ name: "my first iCal" });

// A method is required for outlook to display event as an invitation
calendar.method(ICalCalendarMethod.REQUEST);

const startTime = new Date();
const endTime = new Date();
endTime.setHours(startTime.getHours() + 1);
calendar.createEvent({
  start: startTime,
  end: endTime,
  summary: "Example Event",
  description: "It works ;)",
  location: "my room",
  url: "http://sebbo.net/",
});

export async function GET() {
  const session = await auth();
  if (!session) throw new Error("User is not logged in");
  else {
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
