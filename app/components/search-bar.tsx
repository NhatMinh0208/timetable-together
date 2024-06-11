"use client";
import { AddAttendanceState, addAttendance } from "../lib/actions";
import { useFormState } from "react-dom";
export function SearchBar() {
  const initialState: AddAttendanceState = {};
  const [state, dispatch] = useFormState<AddAttendanceState, FormData>(
    addAttendance,
    initialState,
  );
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-2" action={dispatch}>
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
            className="flex w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add event
          </button>
          {state?.message}
        </div>
      </form>
    </div>
  );
}
