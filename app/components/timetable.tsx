"use client";
import {
  User,
  UserId,
  EventId,
  ScheduleId,
  ExtendedEvent,
  ExtendedSchedule,
  TimetableBlock,
  Note,
} from "@/app/lib/types";
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
  activeEvent,
  currentUser,
  attendanceLookup,
  eventLookup,
  scheduleLookup,
  userLookup,
  recvNotes,
  handleAttendanceUpdate,
}: {
  activeEvent: string;
  currentUser: User;
  attendanceLookup: Map<EventId, Map<ScheduleId, UserId[]>>;
  eventLookup: Map<EventId, ExtendedEvent>;
  scheduleLookup: Map<ScheduleId, ExtendedSchedule>;
  userLookup: Map<UserId, User>;
  recvNotes: Note[];
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
  for (const [eventId, eventMap] of attendanceLookup.entries()) {
    const event = eventLookup.get(eventId);
    if (!event)
      throw new Error("Application Error: Event not in lookup table yet");
    if (event.id == activeEvent) {
      for (const schedule of event.schedules) {
        const userIds = eventMap.get(schedule.id);
        let isCurrentUser = false;
        const usernames = userIds
          ? userIds.map((id) => {
              if (id === currentUser.id) isCurrentUser = true;
              const user = userLookup.get(id);
              if (user) return user.name;
              else return "Application Error: User not in lookup table yet";
            })
          : [];
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
              isCurrentUser: isCurrentUser,
              eventIsActive: event.id === activeEvent,
              users: usernames,
            });
          }
        }
      }
    } else {
      for (const [scheduleId, userIds] of eventMap.entries()) {
        const schedule = scheduleLookup.get(scheduleId);
        if (!schedule)
          throw new Error(
            "Application Error: Schedule not in lookup table yet",
          );
        let isCurrentUser = false;
        const usernames = userIds.map((id) => {
          if (id === currentUser.id) isCurrentUser = true;
          const user = userLookup.get(id);
          if (!user) return "";
          else return user.name;
        });

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
              isCurrentUser: isCurrentUser,
              eventIsActive: event.id === activeEvent,
              users: usernames,
            });
          }
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

  const notesInView = recvNotes.filter((note) => {
    return (
      note.position.getTime() >= window.getTime() &&
      note.position.getTime() < window.getTime() + TICKS_IN_WEEK
    );
  });

  return (
    <div
      className={
        "flex flex-col h-full w-2/3 mx-auto px-2 py-2 space-y-2 rounded-lg bg-slate-200"
      }
    >
      <TimetableNavbar
        window={window}
        handleLeftArrow={setPrevWeek}
        handleRightArrow={setNextWeek}
      />
      <TimetableWindow
        window={window}
        blocks={blocks}
        notes={notesInView}
        handleAttendanceUpdate={handleAttendanceUpdate}
      />
    </div>
  );
}
