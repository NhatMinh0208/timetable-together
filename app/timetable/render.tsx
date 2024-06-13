// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
"use client";
import { useCallback, useState } from "react";
import { RightCard } from "@/app/components/right-card";
import { removeUserAttendance, updateUserAttendance } from "@/app/lib/actions";
import { ExtendedAttendance } from "@/app/lib/types";
import { Timetable } from "@/app/components/timetable";
import { REMOVE_CMD } from "@/app/lib/constants";
export default function Render({
  attendances,
}: {
  attendances: ExtendedAttendance[];
}) {
  const attendanceMapInit: { [eventId: string]: string } = {};
  attendances.forEach((attendance) => {
    attendanceMapInit[attendance.event.id] = attendance.scheduleId;
  });

  const [attendanceMap, setAttendanceMap] = useState(attendanceMapInit);
  const [activeEvent, setActiveEvent] = useState("");

  const handleAttendanceUpdate = useCallback(
    async (eventId: string, scheduleId: string) => {
      if (scheduleId === REMOVE_CMD) {
        removeUserAttendance(eventId);
      } else if (activeEvent == eventId) {
        setAttendanceMap((att) => {
          att[eventId] = scheduleId;
          return att;
        });
        updateUserAttendance(eventId, scheduleId);
        setActiveEvent("");
      } else {
        setActiveEvent(eventId);
      }
    },
    [activeEvent],
  );

  return (
    <main className="flex h-dvh w-dvw flex-row space-x-2 px-2 py-2">
      <Timetable
        events={attendances.map((attendance) => attendance.event)}
        attendanceMap={attendanceMap}
        activeEvent={activeEvent}
        handleAttendanceUpdate={handleAttendanceUpdate}
      />
      <RightCard
        events={attendances.map((attendance) => attendance.event)}
        attendanceMap={attendanceMap}
        activeEvent={activeEvent}
        handleAttendanceUpdate={handleAttendanceUpdate}
      />
    </main>
  );
}
// 3:50
