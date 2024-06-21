"use client";
import {
  AddAttendanceState,
  AddFollowState,
  addAttendance,
  addFollowRequest,
} from "@/app/lib/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormState } from "react-dom";
import { useDebouncedCallback } from "use-debounce";
export function EventSearchBar({
  eventSearchResults,
}: {
  eventSearchResults: {
    name: string;
  }[];
}) {
  const initialState: AddAttendanceState = {};
  const [state, dispatch] = useFormState<AddAttendanceState, FormData>(
    addAttendance,
    initialState,
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("eventQuery", term);
    } else {
      params.delete("eventQuery");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <form className="w-full space-y-2 flex-col" action={dispatch}>
      <div>
        <div className="mt-2">
          <input
            id="eventName"
            name="eventName"
            type="text"
            autoComplete="eventName"
            placeholder="Enter event name..."
            defaultValue={searchParams.get("eventQuery")?.toString()}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            required
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      {eventSearchResults.map((result, i) => (
        <button
          className="rounded-md border-2 w-full h-10 border-slate-400 bg-slate-200 hover:bg-slate-300"
          key={i}
          formAction={() => {
            const payload = new FormData();
            payload.set("eventName", result.name);
            dispatch(payload);
            handleSearch("");
          }}
        >
          {result.name}
        </button>
      ))}
      <div>
        <button
          type="submit"
          className="w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add event
        </button>
        {state?.message}
      </div>
    </form>
  );
}

export function UserSearchBar({
  userSearchResults,
}: {
  userSearchResults: {
    name: string;
    email: string;
  }[];
}) {
  const initialState: AddFollowState = {};
  const [state, dispatch] = useFormState<AddFollowState, FormData>(
    addFollowRequest,
    initialState,
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("userQuery", term);
    } else {
      params.delete("userQuery");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <form className="w-full space-y-2 flex-col" action={dispatch}>
      <div>
        <div className="mt-2">
          <input
            id="user"
            name="user"
            type="text"
            autoComplete="user"
            placeholder="Enter user name or email..."
            defaultValue={searchParams.get("userQuery")?.toString()}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            required
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {userSearchResults.map((result, i) => (
        <button
          className="rounded-md border-2 w-full h-10 border-slate-400 bg-slate-200 hover:bg-slate-300"
          key={i}
          formAction={() => {
            const payload = new FormData();
            payload.set("user", result.name);
            dispatch(payload);
            handleSearch("");
          }}
        >
          <div>{result.name}</div>
          <div>{result.email}</div>
        </button>
      ))}

      <div>
        <button
          type="submit"
          className="w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Request to follow
        </button>
        {state?.message}
      </div>
    </form>
  );
}
