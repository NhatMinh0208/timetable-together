"use client";
import { SearchBar } from "@/app/components/search-bar";
import { AttendanceManager } from "@/app/components/attendance-manager";
import { ExtendedAttendanceEvent } from "@/app/lib/types";
export function RightCard({
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
    <div
      className={
        "flex flex-col w-1/5 mx-auto px-2 py-2 space-y-2 rounded-lg bg-slate-200 text-xs"
      }
    >
      <SearchBar />
      <AttendanceManager
        events={events}
        attendanceMap={attendanceMap}
        activeEvent={activeEvent}
        handleAttendanceUpdate={handleAttendanceUpdate}
      />
    </div>
  );
}
