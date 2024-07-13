"use client";
import { Event } from "@/app/lib/types";
import { DeleteEvent, ViewEvent } from "./buttons";
export function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-slate-400 mx-1 my-1 rounded-md px-2 py-2 flex flex-col grow-0">
      <div className="text-md text-center font-semibold">{event.name}</div>
      <div className="h-2"></div>
      <div className="text-pretty text-ellipsis overflow-hidden grow">
        {event.description}
      </div>
      <div className="h-2"></div>
      <div className="flex flex-row">
        <ViewEvent labl="View" id={event.id} />
        <DeleteEvent labl="Delete" id={event.id} />
      </div>
    </div>
  );
}
