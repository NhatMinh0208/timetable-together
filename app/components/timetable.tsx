"use client";
import * as placeholder from "@/app/lib/placeholder-data";
import { EventDisplay } from "@/app/components/event-display";
import { useCallback, useState } from "react";
export function Timetable() {
  const attendanceMap: { [eventId: string]: string } = {};
  placeholder.sampleAttendances.forEach((attendance) => {
    attendanceMap[attendance.eventId] = attendance.scheduleId;
  });
  const [attendance, setAttendance] = useState(attendanceMap);
  const [activeEvent, setActiveEvent] = useState("");

  console.log(attendance);
  console.log(activeEvent);
  const handleClick = useCallback(
    (eventId: string, scheduleId: string) => {
      if (activeEvent == eventId) {
        setAttendance((att) => {
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
    <div className={"max-w-sm mx-auto"}>
      {placeholder.sampleEvents.map((event) => (
        <EventDisplay
          key={event.id}
          event={event}
          attendingSchedule={attendance[event.id]}
          isActive={activeEvent === event.id}
          onClick={(altId) => handleClick(event.id, altId)}
        />
      ))}
    </div>
  );
}
