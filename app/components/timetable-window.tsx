"use client";

import clsx from "clsx";
import { TimetableBlock } from "../lib/types";
import { weekdays } from "../lib/constants";

export function TimetableWindow({
  blocks,
  handleAttendanceUpdate,
}: {
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
    <div className="flex flex-row h-full w-full bg-slate-400 text-xs space-x-1 space-y-1 overflow-auto">
      <div className="flex flex-col w-16 bg-slate-600">
        {blocksByDay.map((day, i) => {
          return (
            <div
              key={i}
              className={clsx("bg-slate-100", {
                "h-24": day.length === 2,
                "h-36": day.length === 3,
                "h-48": day.length === 4,
                "h-60": day.length === 5,
                "h-72": day.length === 6,
                "h-84": day.length === 7,
                "h-96": day.length >= 8,
              })}
            >
              {weekdays[i]}
              {" - "}
              {day.length}
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
