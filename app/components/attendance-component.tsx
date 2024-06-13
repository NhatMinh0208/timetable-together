"use client";
import { clsx } from "clsx";
import {
  ExtendedAttendanceEvent,
  ExtendedAttendanceSchedule,
} from "@/app/lib/types";

import { REMOVE_CMD, TICKS_IN_DAY } from "@/app/lib/constants";

export function ScheduleButton({
  schedule,
  isActive,
  onClick,
}: {
  schedule: ExtendedAttendanceSchedule;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={clsx(
        "flex flex-col grow justify-center rounded-md px-2 py-1 \
font-semibold leading-6 text-white shadow-sm text-left \
focus-visible:outline focus-visible:outline-2 \
focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        {
          "bg-sky-300 hover:bg-sky-200": !isActive,
          "bg-sky-500 hover:bg-sky-400": isActive,
        },
      )}
      onClick={onClick}
    >
      <p>{"Schedule " + schedule.name}</p>
      {schedule.sessions.map((session) => {
        const originStartTime =
          (((session.startTime.getTime() - session.startDate.getTime()) %
            TICKS_IN_DAY) +
            TICKS_IN_DAY) %
          TICKS_IN_DAY;
        const fullStartDate = new Date(
          session.startDate.getTime() + originStartTime,
        );
        const fullEndDate = new Date(
          session.endDate.getTime() + originStartTime,
        );
        return (
          <p key={session.id}>
            {fullStartDate.toString().match("^([a-zA-Z]*) ")?.[1]}{" "}
            {
              session.startTime
                .toString()
                .match(" ([0-9][0-9]:[0-9][0-9])")?.[1]
            }
            {" - "}
            {session.endTime.toString().match(" ([0-9][0-9]:[0-9][0-9])")?.[1]}
            {" @ "}
            {session.place}
            {" ("}
            {
              fullStartDate
                .toString()
                .match("^[a-zA-Z]* ([a-zA-Z]* [0-9]*) ")?.[1]
            }
            {" - "}
            {
              fullEndDate
                .toString()
                .match("^[a-zA-Z]* ([a-zA-Z]* [0-9]*) ")?.[1]
            }
            {")"}
          </p>
        );
      })}
    </button>
  );
}

export function AttendanceComponent({
  event,
  attendingSchedule,
  isActive,
  onClick,
}: {
  event: ExtendedAttendanceEvent;
  attendingSchedule: string;
  isActive: boolean;
  onClick: (scheduleId: string) => void;
}) {
  event.schedules.map;
  const scheduleCards = event.schedules
    .sort((a, b) => {
      return a.name < b.name ? -1 : a.name === b.name ? 0 : 1;
    })
    .map((schedule) => {
      return (
        <ScheduleButton
          key={schedule.id}
          schedule={schedule}
          isActive={attendingSchedule == schedule.id}
          onClick={() => onClick(schedule.id)}
        />
      );
    });
  const inactiveCard = event.schedules
    .filter((alt) => {
      return alt.id === attendingSchedule;
    })
    .map((schedule) => {
      return (
        <ScheduleButton
          key={schedule.id}
          schedule={schedule}
          isActive={attendingSchedule == schedule.id}
          onClick={() => onClick(schedule.id)}
        />
      );
    });
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-sm flex flex-row">
        <p className="grow">{event.name}</p>
        <button
          className={clsx(
            "flex flex-col w-500 justify-center rounded-md px-2 py-1 \
font-semibold leading-6 text-white shadow-sm \
focus-visible:outline focus-visible:outline-2 \
focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
            "bg-red-500 hover:bg-red-400",
          )}
          onClick={() => onClick(REMOVE_CMD)}
        >
          Remove
        </button>
      </div>
      {isActive ? scheduleCards : inactiveCard}
    </div>
  );
}
