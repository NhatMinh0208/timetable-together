"use client";

import clsx from "clsx";
import { TimetableBlock } from "@/app/lib/types";
import { TICKS_IN_DAY, weekdays } from "@/app/lib/constants";

export function TimetableDay({
  dayBlocks,
  handleAttendanceUpdate,
}: {
  dayBlocks: TimetableBlock[][];
  handleAttendanceUpdate: (eventId: string, scheduleId: string) => void;
}) {
  const cells = [];
  for (let j = 0; j < 24; j++)
    cells.push(
      <div
        key={j}
        style={{
          gridRowStart: 1,
          gridColumnStart: j * 4 + 1,
          gridRowEnd: dayBlocks.length + 1,
          gridColumnEnd: j * 4 + 5,
        }}
        className={clsx(
          "border-t-2 border-l-2 border-l-slate-300 border-t-slate-600",
        )}
      ></div>,
    );
  const blocks = dayBlocks.map((row, i) =>
    row.map((block, j) => {
      return (
        <button
          key={i.toString() + " " + j.toString()}
          onClick={() =>
            handleAttendanceUpdate(block.eventId, block.scheduleId)
          }
          style={{
            gridRowStart: i + 1,
            gridRowEnd: i + 2,
            gridColumnStart:
              block.startTime.getHours() * 4 +
              block.startTime.getMinutes() / 15 +
              1,
            gridColumnEnd:
              block.endTime.getHours() * 4 +
              block.endTime.getMinutes() / 15 +
              1,
          }}
          className={clsx(
            "truncate justify-center rounded-md px-1 \
font-semibold leading-1 text-white shadow-sm text-left \
focus-visible:outline focus-visible:outline-2 \
focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
            {
              "bg-sky-300 hover:bg-sky-200": !block.isCurrent,
              "bg-sky-500 hover:bg-sky-400": block.isCurrent,
            },
          )}
        >
          <div>{block.eventName}</div>
          <div>
            {"[" + block.scheduleName + "]"}{" "}
            {block.startTime.toString().match(" ([0-9][0-9]:[0-9][0-9])")?.[1]}
            {" - "}
            {block.endTime.toString().match(" ([0-9][0-9]:[0-9][0-9])")?.[1]}
          </div>
          <div>{block.place}</div>
        </button>
      );
    }),
  );
  return (
    <div
      style={{
        gridTemplateColumns: "repeat(96,40px)",
        gridTemplateRows: "repeat(" + dayBlocks.length.toString() + ",72px)",
      }}
      className={clsx("grid")}
    >
      {cells}
      {blocks}
    </div>
  );
}
