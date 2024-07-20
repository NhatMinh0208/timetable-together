"use client";

import clsx from "clsx";
import { TimetableBlock } from "@/app/lib/types";
import { TICKS_IN_DAY, weekdays } from "@/app/lib/constants";
import { hashCode } from "../lib/password";

export function TimetableDay({
  startRow,
  dayBlocks,
  handleAttendanceUpdate,
}: {
  startRow: number;
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
          zIndex: 0,
        }}
        className={clsx("border-t-2 border-l-2 border-l-slate-300")}
      ></div>,
    );
  const blocks = dayBlocks.map((row, i) =>
    row.map((block, j) => {
      const backgroundColor =
        block.eventName === "[Private session]" && block.scheduleName === ""
          ? "#9999A0"
          : "#" +
            hashCode(block.eventId).toString(16).padStart(6, "0").slice(-6);
      return (
        <button
          key={i.toString() + " " + j.toString()}
          onClick={
            block.isCurrentUser || block.eventIsActive
              ? () => handleAttendanceUpdate(block.eventId, block.scheduleId)
              : () => {}
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
            backgroundColor,
            zIndex: 1,
          }}
          className={clsx(
            "truncate justify-center rounded-md px-1 \
font-semibold leading-1 text-white shadow-sm text-left \
focus-visible:outline focus-visible:outline-2 \
focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
            {
              "opacity-50 hover:opacity-75":
                !block.isCurrentUser && block.eventIsActive,
              "opacity-100 hover:opacity-90": !(
                !block.isCurrentUser && block.eventIsActive
              ),
            },
          )}
        >
          <div className="truncate">{block.eventName}</div>
          <div>
            {"[" + block.scheduleName + "]"}{" "}
            {block.startTime.toString().match(" ([0-9][0-9]:[0-9][0-9])")?.[1]}
            {" - "}
            {block.endTime.toString().match(" ([0-9][0-9]:[0-9][0-9])")?.[1]}
          </div>
          <div>{block.place}</div>
          <div className="text-wrap">{block.users.join(", ")}</div>
        </button>
      );
    }),
  );
  return (
    <div
      style={{
        gridRowStart: startRow + 2,
        gridColumnStart: 2,
        gridRowEnd: startRow + dayBlocks.length + 2,
        gridColumnEnd: 98,
        gridTemplateColumns: "repeat(96,60px)",
        gridTemplateRows: "repeat(" + dayBlocks.length.toString() + ",80px)",
        zIndex: 0,
      }}
      className={clsx("grid")}
    >
      {cells}
      {blocks}
    </div>
  );
}
