"use client";
import { EventSearchBar } from "@/app/components/search-bar";
import { AttendanceManager } from "@/app/components/attendance-manager";
import { ExtendedEvent } from "@/app/lib/types";
import { Export } from "@/app/components/link-buttons";
export function OverviewCard({
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
    <div
      className={
        "flex flex-col h-full w-1/6 grow-0 mx-auto px-2 py-2 space-y-2 rounded-lg bg-slate-200 text-xs"
      }
    >
      <EventSearchBar />
      <AttendanceManager
        events={events}
        attendanceMap={attendanceMap}
        activeEvent={activeEvent}
        handleAttendanceUpdate={handleAttendanceUpdate}
      />

      <Export labl="Export timetable" />
    </div>
  );
}
