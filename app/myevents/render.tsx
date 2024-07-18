// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
"use client";
import React from "react";
import { Event } from "@/app/lib/types";
import { EventCard } from "@/app/components/event-card";
import { CreateEvent } from "@/app/components/buttons";

export default function Render({ events }: { events: Event[] }) {
  return (
    <main className="flex h-full w-dvw space-x-2 px-2 py-2">
      <div className="bg-slate-300 w-dvw rounded-md px-2 py-2 space-y-2 ">
        <div className="h-[4%] w-full text-2xl text-center font-semibold">
          Your events
        </div>
        <div className="h-[5%] w-full">
          <CreateEvent labl="Create event" />
        </div>
        <div className=" w-full h-[91%] grid grid-cols-5 grid-rows-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </main>
  );
}
// 3:50
// 1:40
