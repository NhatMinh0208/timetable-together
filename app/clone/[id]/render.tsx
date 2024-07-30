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
    <main className="h-full p-2">
      <div className="h-full rounded-md bg-slate-300 p-2">
        <div className="mx-auto max-w-screen-lg text-xl">
          <h1 className="text-center text-2xl font-semibold">
            Clone from {event.private ? "private session" : "event"}{" "}
            {event.name}
          </h1>
          <EventInputElement initialInput={convertedInput} readOnly={false} />
        </div>
      </div>
    </main>
  );
}
// 3:50
// 1:40
