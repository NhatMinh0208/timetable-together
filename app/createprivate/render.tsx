// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
"use client";
import { EventInput } from "@/app/lib/types";
import { PrivateSessionInputElement } from "../components/private-session-input-element";
const initialInput: EventInput = {
  name: "",
  description: "",
  private: false,
  schedules: [],
};
export default function Render() {
  return (
    <main className="flex h-full w-dvw flex-row space-x-2 px-2 py-2">
      <div className="bg-slate-300 w-dvw rounded-md flex flex-row px-2 py-2 space-x-2">
        <div className="h-full w-1/5"> </div>
        <div className="h-full w-3/5 text-xl">
          <div className="text-2xl text-center font-semibold">
            Add a private session
          </div>
          <div className="text-md text-center">
            This session&apos;s name, description and location can only be
            viewed by you.
          </div>
          <PrivateSessionInputElement readOnly={false} />
        </div>
        <div className="h-full w-1/5"> </div>
      </div>
    </main>
  );
}
// 3:50
// 1:40
