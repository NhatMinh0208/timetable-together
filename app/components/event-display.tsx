"use client";
import { Session, Alternative, Event } from "@/app/lib/placeholder-data";
import { clsx } from "clsx";
export function AlternativeCard({
  alternative,
  isActive,
  onClick,
}: {
  alternative: Alternative;
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
      <div>{alternative.name + "|"}</div>
      {alternative.sessions.map((session) => {
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
  attendingAlternative,
  isActive,
  onClick,
}: {
  event: Event;
  attendingAlternative: string;
  isActive: boolean;
  onClick: (alternativeId: string) => void;
}) {
  event.alternatives.map;
  const alternativeCards = event.alternatives.map((alternative) => {
    return (
      <AlternativeCard
        key={alternative.id}
        alternative={alternative}
        isActive={attendingAlternative == alternative.id}
        onClick={() => onClick(alternative.id)}
      />
    );
  });
  const inactiveCard = event.alternatives
    .filter((alt) => {
      return alt.id === attendingAlternative;
    })
    .map((alternative) => {
      return (
        <AlternativeCard
          key={alternative.id}
          alternative={alternative}
          isActive={attendingAlternative == alternative.id}
          onClick={() => onClick(alternative.id)}
        />
      );
    });
  return (
    <div>
      <div>{event.name}</div>
      {isActive ? alternativeCards : inactiveCard}
    </div>
  );
}
