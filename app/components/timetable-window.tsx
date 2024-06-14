"use client";

import clsx from "clsx";
import { TimetableBlock } from "@/app/lib/types";
import { TICKS_IN_DAY, weekdays } from "@/app/lib/constants";
import { TimetableDay } from "@/app/components/timetable-day";
export function TimetableWindow({
  window,
  blocks,
  handleAttendanceUpdate,
}: {
  window: Date;
  blocks: TimetableBlock[];
  handleAttendanceUpdate: (eventId: string, scheduleId: string) => void;
}) {
  const blocksByDay: TimetableBlock[][][] = [[], [], [], [], [], [], []];
  for (const blk of blocks) {
    const ind = (blk.startTime.getDay() + 6) % 7;
    let done = false;
    for (const row of blocksByDay[ind])
      if (row[row.length - 1].endTime.getTime() <= blk.startTime.getTime()) {
        row.push(blk);
        done = true;
        break;
      }
    if (!done) {
      blocksByDay[ind].push([blk]);
    }
  }
  for (const day of blocksByDay) while (day.length < 2) day.push([]);
  return (
    <div className="flex flex-row text-xs overflow-auto">
      <div className="flex flex-col w-16 shrink-0">
        <div className={clsx("h-12 shrink-0")}></div>
        {blocksByDay.map((day, i) => {
          return (
            <div
              key={i}
              style={{
                height: day.length * 72,
              }}
              className={clsx(
                "border-slate-600 border-t-2 flex flex-col place-content-center text-center shrink-0",
              )}
            >
              <div className="text-sm">{weekdays[i]}</div>
              <div className="text-xl">
                {new Date(window.getTime() + TICKS_IN_DAY * i).getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col">
        <div className={clsx("flex flex-row h-12 shrink-0")}>
          {(() => {
            const HOURS = [
              "12AM",
              "1AM",
              "2AM",
              "3AM",
              "4AM",
              "5AM",
              "6AM",
              "7AM",
              "8AM",
              "9AM",
              "10AM",
              "11AM",
              "12PM",
              "1PM",
              "2PM",
              "3PM",
              "4PM",
              "5PM",
              "6PM",
              "7PM",
              "8PM",
              "9PM",
              "10PM",
              "11PM",
            ];
            return HOURS.map((x) => {
              return (
                <div
                  key={x}
                  className="w-40 border-l-2 border-slate-300 align-bottom shrink-0"
                >
                  {x}
                </div>
              );
            });
          })()}
        </div>

        {blocksByDay.map((day, i) => {
          return (
            <div key={i}>
              <TimetableDay
                dayBlocks={day}
                handleAttendanceUpdate={handleAttendanceUpdate}
              />
            </div>
          );
        })}
      </div>
      {/* {blocks.map((block) => {
    return (
        <button className={clsx(
          "flex flex-col grow justify-center rounded-md px-2 py-1 \
    font-semibold leading-6 text-white shadow-sm text-left \
    focus-visible:outline focus-visible:outline-2 \
    focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
          {
            "bg-sky-300 hover:bg-sky-200": !block.isCurrent,
            "bg-sky-500 hover:bg-sky-400": block.isCurrent,
          },
        )} onClick={() => handleAttendanceUpdate(block.eventId, block.scheduleId)}>
          <p>
            {block.eventName}
            {' ['}
            {block.scheduleName}
            {'] '}
          </p>
          <p>
            {block.startTime.toString().match(" ([0-9][0-9]:[0-9][0-9])")?.[1]}
            {' - '}
            {block.endTime.toString().match(" ([0-9][0-9]:[0-9][0-9])")?.[1]}
            {' @ '}
            {block.place}
          </p>
        </button>)
      })} */}
    </div>
  );
}
