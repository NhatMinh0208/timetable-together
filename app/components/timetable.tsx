"use client";
import { SearchBar } from "@/app/components/search-bar";
import { AttendanceManager } from "@/app/components/attendance-manager";
import { ExtendedAttendanceEvent } from "@/app/lib/types";
import Image from "next/image";
import LeftArrow from "@/app/static/left-arrow.svg";
import RightArrow from "@/app/static/right-arrow.svg";

export function Timetable({
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
        "flex flex-col h-full w-full mx-auto px-2 py-2 space-y-2 rounded-lg bg-slate-200"
      }
    >
      <div className="flex flex-row flex-none justify-center h-12 w-full rounded-lg bg-slate-400 text-xl">
        <button className="h-full flex-row place-content-center">
          <Image src={LeftArrow} alt={"Left arrow"}></Image>
        </button>
        <p className="h-full flex-row place-content-center">
          {new Date().toDateString()}
        </p>
        <button className="h-full flex-row place-content-center">
          <Image src={RightArrow} alt={"Right arrow"}></Image>
        </button>
      </div>

      <div className="flex grow rounded-lg bg-slate-400 text-xs px-2 py-2 overflow-auto"></div>
    </div>
  );
}
