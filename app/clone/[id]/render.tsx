// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
"use client";
import { EventInputElement } from "@/app/components/event-input-element";
import { convertEventToInput } from "@/app/lib/input";
import { ExtendedEvent } from "@/app/lib/types";
export default function Render({
  event,
  ownerName,
}: {
  event: ExtendedEvent;
  ownerName: string;
}) {
  const convertedInput = convertEventToInput(event);
  return (
    <main className="flex h-full w-dvw flex-row space-x-2 px-2 py-2">
      <div className="bg-slate-300 w-dvw rounded-md flex flex-row px-2 py-2 space-x-2">
        <div className="h-full w-1/5"> </div>
        <div className="h-full w-3/5 text-xl">
          <div className="text-2xl text-center font-semibold">
            Clone from {event.private ? "private session" : "event"}{" "}
            {event.name}
          </div>
          <EventInputElement initialInput={convertedInput} readOnly={false} />
        </div>
        <div className="h-full w-1/5"> </div>
      </div>
    </main>
  );
}
// 3:50
// 1:40
