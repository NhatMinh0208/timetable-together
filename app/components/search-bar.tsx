"use client";
import {
  AddAttendanceState,
  AddFollowState,
  addAttendance,
  addFollowRequest,
} from "@/app/lib/actions";
import { useFormState } from "react-dom";
export function EventSearchBar() {
  const initialState: AddAttendanceState = {};
  const [state, dispatch] = useFormState<AddAttendanceState, FormData>(
    addAttendance,
    initialState,
  );
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
            required
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

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

export function UserSearchBar() {
  const initialState: AddFollowState = {};
  const [state, dispatch] = useFormState<AddFollowState, FormData>(
    addFollowRequest,
    initialState,
  );
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
            required
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

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
