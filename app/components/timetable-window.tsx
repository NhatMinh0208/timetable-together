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

  let cnt1 = 0;
  let cnt2 = 0;

  return (
    <div
      style={{
        gridTemplateColumns: "repeat(97,60px)",
        gridTemplateRows:
          "24px repeat(" +
          blocksByDay
            .map((x) => x.length)
            .reduce((sum, cur) => {
              return sum + cur;
            }, 0) +
          ",80px)",
      }}
      className="grid text-xs overflow-auto"
    >
      <div className={clsx("h-6 shrink-0")}></div>
      {blocksByDay.map((day, i) => {
        cnt1 += day.length;
        return (
          <div
            key={i}
            style={{
              gridRowStart: cnt1 - day.length + 2,
              gridColumnStart: 1,
              gridRowEnd: cnt1 + 2,
              gridColumnEnd: 2,
            }}
            className={clsx(
              "bg-slate-200 border-t-slate-600 border-t-2 border-r-slate-600 border-r-2 place-content-center text-center shrink-0 sticky left-0",
            )}
          >
            <div className="text-sm">{weekdays[i]}</div>
            <div className="text-xl">
              {new Date(window.getTime() + TICKS_IN_DAY * i).getDate()}
            </div>
          </div>
        );
      })}
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
        return HOURS.map((x, i) => {
          return (
            <div
              style={{
                gridRowStart: 1,
                gridColumnStart: i * 4 + 2,
                gridRowEnd: 2,
                gridColumnEnd: i * 4 + 3,
              }}
              key={x}
              className="bg-slate-200 w-60 border-l-2 border-l-slate-600 border-b-2 border-b-slate-600 align-bottom shrink-0 sticky top-0"
            >
              {x}
            </div>
          );
        });
      })()}

      {blocksByDay.map((day, i) => {
        cnt2 += day.length;
        return (
          <TimetableDay
            startRow={cnt2 - day.length}
            dayBlocks={day}
            handleAttendanceUpdate={handleAttendanceUpdate}
            key={i}
          />
        );
      })}
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
