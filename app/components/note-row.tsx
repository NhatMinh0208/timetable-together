"use client";

import clsx from "clsx";
import Image from "next/image";

import NoteIcon from "@/app/static/note.svg";
import NoteIconUnread from "@/app/static/note-unread.svg";
import { Note } from "@/app/lib/types";
import { NoteCard } from "@/app/components/note-card";
import { useState } from "react";
import { updateUserNoteRead } from "../lib/actions";

export function NoteRow({
  startRow,
  window,
  activeCell,
  notes,
  changeActive,
}: {
  startRow: number;
  window: Date;
  activeCell: number;
  notes: Note[];
  changeActive: (cell: number) => void;
}) {
  const cells = [];

  const notesByHour: Note[][] = [];
  for (let j = 0; j < 24; j++) notesByHour.push([]);
  for (const note of notes) {
    const ind = note.position.getHours();
    notesByHour[ind].push(note);
  }

  const cellReadInit: boolean[] = [];
  for (let j = 0; j < 24; j++) {
    let readStatus = true;
    for (const note of notesByHour[j]) if (!note.read) readStatus = false;
    cellReadInit.push(readStatus);
  }
  const [cellRead, setCellRead] = useState(cellReadInit);

  async function readCell(x: number) {
    if (!cellRead[x]) {
      setCellRead((c) => {
        c[x] = true;
        return c;
      });
      const tasks: Promise<void>[] = [];
      for (const note of notesByHour[x]) {
        tasks.push(updateUserNoteRead(note.id));
      }
      await Promise.all(tasks);
    }
  }

  for (let j = 0; j < 24; j++)
    cells.push(
      <div
        key={j}
        style={{
          gridRowStart: 1,
          gridColumnStart: j * 4 + 1,
          gridRowEnd: 2,
          gridColumnEnd: j * 4 + 5,
        }}
        className={clsx(
          "border-t-2 border-l-2 border-l-slate-300 border-t-slate-300 flex flex-row flex-nowrap overflow-visible space-x-1 py-2",
        )}
      >
        <Image
          className="relative"
          src={cellRead[j] ? NoteIcon : NoteIconUnread}
          alt="Note icon"
          onClick={() => {
            if (activeCell === j) changeActive(-1);
            else {
              changeActive(j);
              readCell(j);
            }
          }}
        />
        <NoteCard
          window={new Date(window.getTime() + 1000 * 3600 * j)}
          notes={notesByHour[j]}
          hidden={activeCell !== j}
        />
      </div>,
    );
  return (
    <div
      style={{
        gridRowStart: startRow + 2,
        gridColumnStart: 2,
        gridRowEnd: startRow + 3,
        gridColumnEnd: 98,
        gridTemplateColumns: "repeat(96,60px)",
        gridTemplateRows: "40px",
      }}
      className={clsx("grid")}
    >
      {cells}
    </div>
  );
}
