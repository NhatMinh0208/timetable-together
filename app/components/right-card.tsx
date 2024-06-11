import { useCallback, useState } from "react";
import { SearchBar } from "./search-bar";
import { AttendanceManager } from "./attendance-manager";
import { getUserAttendances } from "@/app/lib/actions";
export async function RightCard() {
  const attendances = await getUserAttendances();
  return (
    <div
      className={
        "flex flex-col grow max-w-sm mx-auto px-2 py-2 space-y-2 mb-2 mt-2 rounded-lg bg-slate-200 text-xs"
      }
    >
      <SearchBar />
      <AttendanceManager attendances={attendances} />
    </div>
  );
}
