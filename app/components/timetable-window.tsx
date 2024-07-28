"use client";

import clsx from "clsx";
import { Note, TimetableBlock } from "@/app/lib/types";
import { TICKS_IN_DAY, weekdays } from "@/app/lib/constants";
import { TimetableDay } from "@/app/components/timetable-day";
import { NoteRow } from "./note-row";
import { useState } from "react";
export function TimetableWindow({
  window,
  blocks,
  notes,
  handleAttendanceUpdate,
}: {
  window: Date;
  blocks: TimetableBlock[];
  notes: Note[];
  handleAttendanceUpdate: (eventId: string, scheduleId: string) => void;
}) {
  const blocksByDay: TimetableBlock[][][] = [[], [], [], [], [], [], []];
  const notesByDay: Note[][] = [[], [], [], [], [], [], []];
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
  let cnt3 = 0;

  for (const note of notes) {
    const ind = (note.position.getDay() + 6) % 7;
    notesByDay[ind].push(note);
  }

  const [activeNoteCell, setActiveNoteCell] = useState({
    day: -1,
    cell: -1,
  });

  return (
    <div
      style={{
        gridTemplateColumns: "repeat(97,60px)",
        gridTemplateRows:
          "24px " +
          blocksByDay
            .map((x) => "40px repeat(" + x.length.toString() + ",80px)")
            .join(" "),
      }}
      className="grid text-xs overflow-auto"
    >
      <div className={clsx("h-6 shrink-0")}></div>
      {blocksByDay.map((day, i) => {
        cnt1 += day.length + 1;
        return (
          <div
            key={i + 1000}
            style={{
              gridRowStart: cnt1 - day.length - 1 + 2,
              gridColumnStart: 1,
              gridRowEnd: cnt1 + 2,
              gridColumnEnd: 2,
              zIndex: 100,
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
                zIndex: 100,
              }}
              key={i + 500}
              className="bg-slate-200 w-60 border-l-2 border-l-slate-600 border-b-2 border-b-slate-600 align-bottom shrink-0 sticky top-0"
            >
              {x}
            </div>
          );
        });
      })()}

      {blocksByDay.map((day, i) => {
        cnt2 += day.length + 1;
        return (
          <NoteRow
            startRow={cnt2 - day.length - 1}
            window={new Date(window.getTime() + i * TICKS_IN_DAY)}
            activeCell={activeNoteCell.day === i ? activeNoteCell.cell : -1}
            changeActive={(cell) =>
              setActiveNoteCell({
                day: i,
                cell: cell,
              })
            }
            notes={notesByDay[i]}
            key={i.toString() + " " + window.getTime().toString()}
          />
        );
      })}

      {blocksByDay.map((day, i) => {
        cnt3 += day.length + 1;
        return (
          <TimetableDay
            startRow={cnt3 - day.length}
            dayBlocks={day}
            handleAttendanceUpdate={handleAttendanceUpdate}
            key={i}
          />
        );
      })}
    </div>
  );
}
