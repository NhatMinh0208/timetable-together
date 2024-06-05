"use client";
import { Session, Schedule, Event } from "@/app/lib/placeholder-data";
import { clsx } from "clsx";
export function ScheduleCard({
  schedule,
  isActive,
  onClick,
}: {
  schedule: Schedule;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={clsx(
        "flex w-500 justify-center rounded-md px-3 py-1.5 \
text-sm font-semibold leading-6 text-white shadow-sm \
focus-visible:outline focus-visible:outline-2 \
focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        {
          "bg-sky-300 hover:bg-sky-200": !isActive,
          "bg-sky-500 hover:bg-sky-400": isActive,
        },
      )}
      onClick={onClick}
    >
      <div>{schedule.name + "|"}</div>
      {schedule.sessions.map((session) => {
        return (
          <p key={session.id}>
            {
              session.startTime
                .toISOString()
                .match("T([0-9][0-9]:[0-9][0-9])")?.[1]
            }
            -
            {
              session.endTime
                .toISOString()
                .match("T([0-9][0-9]:[0-9][0-9])")?.[1]
            }
            {" -  " + session.place + ";"}
          </p>
        );
      })}
    </button>
  );
}

export function EventDisplay({
  event,
  attendingSchedule,
  isActive,
  onClick,
}: {
  event: Event;
  attendingSchedule: string;
  isActive: boolean;
  onClick: (scheduleId: string) => void;
}) {
  event.schedules.map;
  const scheduleCards = event.schedules.map((schedule) => {
    return (
      <ScheduleCard
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
        <ScheduleCard
          key={schedule.id}
          schedule={schedule}
          isActive={attendingSchedule == schedule.id}
          onClick={() => onClick(schedule.id)}
        />
      );
    });
  return (
    <div>
      <div>{event.name}</div>
      {isActive ? scheduleCards : inactiveCard}
    </div>
  );
}
