"use client";
import { AttendanceComponent } from "@/app/components/attendance-component";
import { useCallback, useState } from "react";
import { ExtendedAttendanceEvent } from "@/app/lib/types";
import { updateUserAttendance } from "../lib/actions";
export function AttendanceManager({
  events,
  attendanceMap,
  activeEvent,
  handleAttendanceUpdate,
}: {
  events: ExtendedAttendanceEvent[];
  attendanceMap: { [eventId: string]: string };
  activeEvent: string;
  handleAttendanceUpdate: (eventId: string, scheduleId: string) => void;
}) {
  return (
    <div className={"overflow-auto space-y-2"}>
      {events.map((event) => (
        <AttendanceComponent
          key={event.id}
          event={event}
          attendingSchedule={attendanceMap[event.id]}
          isActive={activeEvent === event.id}
          onClick={(scheduleId) => handleAttendanceUpdate(event.id, scheduleId)}
        />
      ))}
    </div>
  );
}
