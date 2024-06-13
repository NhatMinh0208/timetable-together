"use client";
import { ExtendedAttendanceEvent, TimetableBlock } from "@/app/lib/types";
import Image from "next/image";
import LeftArrow from "@/app/static/left-arrow.svg";
import RightArrow from "@/app/static/right-arrow.svg";
import { TICKS_IN_DAY, TICKS_IN_WEEK } from "@/app/lib/constants";
import { useCallback, useState } from "react";
import { TimetableWindow } from "./timetable-window";

export function TimetableNavbar({
  window,
  handleLeftArrow,
  handleRightArrow,
}: {
  window: Date;
  handleLeftArrow: () => void;
  handleRightArrow: () => void;
}) {
  return (
    <div className="flex flex-row flex-none justify-center h-12 w-full rounded-lg text-xl">
      <button
        className="h-full flex-row place-content-center"
        onClick={handleLeftArrow}
      >
        <Image src={LeftArrow} alt={"Left arrow"}></Image>
      </button>
      <p className="h-full flex-row place-content-center">
        {window.toString().match("^[a-zA-Z]* ([a-zA-Z]* [0-9]*) ")?.[1]}
        {" - "}
        {
          new Date(window.getTime() + 6 * TICKS_IN_DAY)
            .toString()
            .match("^[a-zA-Z]* ([a-zA-Z]* [0-9]*) ")?.[1]
        }
      </p>
      <button
        className="h-full flex-row place-content-center"
        onClick={handleRightArrow}
      >
        <Image src={RightArrow} alt={"Right arrow"}></Image>
      </button>
    </div>
  );
}

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
  let windowInit = new Date();
  while (windowInit.getDay() != 1) {
    windowInit = new Date(windowInit.getTime() - TICKS_IN_DAY);
  }
  windowInit.setHours(0, 0, 0, 0);

  const [window, setWindow] = useState(windowInit);
  const setNextWeek = useCallback(() => {
    setWindow((window) => new Date(window.getTime() + TICKS_IN_WEEK));
  }, []);
  const setPrevWeek = useCallback(() => {
    setWindow((window) => new Date(window.getTime() - TICKS_IN_WEEK));
  }, []);

  const blocks: TimetableBlock[] = [];

  for (const event of events) {
    for (const schedule of event.schedules)
      if (event.id === activeEvent || schedule.id === attendanceMap[event.id]) {
        for (const session of schedule.sessions) {
          const originStartTime =
            (((session.startTime.getTime() - session.startDate.getTime()) %
              TICKS_IN_DAY) +
              TICKS_IN_DAY) %
            TICKS_IN_DAY;
          const start = new Date(session.startDate.getTime() + originStartTime);
          const end = new Date(session.endDate.getTime() + TICKS_IN_DAY);
          const duration =
            session.endTime.getTime() - session.startTime.getTime();
          let blockTime =
            start.getTime() >= window.getTime()
              ? start.getTime()
              : window.getTime() +
                session.interval * TICKS_IN_DAY -
                1 -
                ((window.getTime() +
                  session.interval * TICKS_IN_DAY -
                  1 -
                  start.getTime()) %
                  (session.interval * TICKS_IN_DAY));
          console.log(start);
          console.log(end);
          for (
            blockTime;
            blockTime < end.getTime() &&
            blockTime < window.getTime() + TICKS_IN_WEEK;
            blockTime += session.interval * TICKS_IN_DAY
          ) {
            blocks.push({
              eventId: event.id,
              scheduleId: schedule.id,
              eventName: event.name,
              scheduleName: schedule.name,
              startTime: new Date(blockTime),
              endTime: new Date(blockTime + duration),
              place: session.place,
              isUser: true,
              isCurrent: schedule.id === attendanceMap[event.id],
            });
          }
        }
      }
  }

  blocks.sort((a, b) =>
    a.startTime.getTime() < b.startTime.getTime()
      ? -1
      : a.startTime.getTime() === b.startTime.getTime()
        ? 0
        : 1,
  );

  return (
    <div
      className={
        "flex flex-col h-full w-5/6 mx-auto px-2 py-2 space-y-2 rounded-lg bg-slate-200"
      }
    >
      <TimetableNavbar
        window={window}
        handleLeftArrow={setPrevWeek}
        handleRightArrow={setNextWeek}
      />
      <TimetableWindow
        blocks={blocks}
        handleAttendanceUpdate={handleAttendanceUpdate}
      />
    </div>
  );
}
