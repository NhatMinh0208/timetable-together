"use client";
import { AttendanceComponent } from "@/app/components/attendance-component";
import { ExtendedEvent } from "@/app/lib/types";
export function AttendanceManager({
  events,
  attendanceMap,
  activeEvent,
  handleAttendanceUpdate,
}: {
  events: ExtendedEvent[];
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
