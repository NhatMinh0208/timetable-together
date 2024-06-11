"use client";
import { AttendanceComponent } from "@/app/components/attendance-component";
import { useCallback, useState } from "react";
import { ExtendedAttendance } from "@/app/lib/types";
export function AttendanceManager({
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

  const handleClick = useCallback(
    (eventId: string, scheduleId: string) => {
      if (activeEvent == eventId) {
        setAttendanceMap((att) => {
          att[eventId] = scheduleId;
          return att;
        });
        setActiveEvent("");
      } else {
        setActiveEvent(eventId);
      }
    },
    [activeEvent],
  );
  return (
    <div className={""}>
      {attendances.map((attendance) => (
        <AttendanceComponent
          key={attendance.attendeeId + " " + attendance.event.id}
          event={attendance.event}
          attendingSchedule={attendanceMap[attendance.event.id]}
          isActive={activeEvent === attendance.event.id}
          onClick={(scheduleId) => handleClick(attendance.event.id, scheduleId)}
        />
      ))}
    </div>
  );
}
