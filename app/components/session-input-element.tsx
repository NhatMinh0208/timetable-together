import { SessionInput } from "@/app/lib/types";
import Image from "next/image";
import { useState } from "react";
import RightArrow from "@/app/static/right-arrow.svg";

import DownArrow from "@/app/static/down-arrow.svg";
import { TextInputElement } from "./text-input-element";

export function SessionInputElement({
  index,
  session,
  changeSession,
  removeSession,
  readOnly,
}: {
  index: number;
  session: SessionInput;
  changeSession: (session: SessionInput) => void;
  removeSession: () => void;
  readOnly: boolean;
}) {
  const initialInput: SessionInput = session;
  const [input, setInput] = useState(initialInput);

  function changeField(field: keyof SessionInput, value: string) {
    setInput((input) => {
      const newSession: SessionInput = {
        id: input.id,
        place: input.place,
        timeZone: input.timeZone,
        startTime: input.startTime,
        endTime: input.endTime,
        startDate: input.startDate,
        endDate: input.endDate,
        interval: input.interval,
      };

      newSession[field] = value;

      changeSession(newSession);
      return newSession;
    });
  }

  const [hidden, setHidden] = useState(readOnly);
  const toggleHidden = () => setHidden((hidden) => !hidden);
  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md bg-purple-300 px-2 py-1 font-semibold"
        onClick={(e) => toggleHidden()}
      >
        <Image src={hidden ? RightArrow : DownArrow} alt="" />
        <div className="grow">Session #{index + 1}</div>
        <button
          onClick={removeSession}
          hidden={readOnly}
          className="justify-center rounded-md bg-red-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Remove
        </button>
      </div>

      <div className="px-6 space-y-2" hidden={hidden}>
        <TextInputElement
          name="place"
          value={input.place}
          placeholder="Enter session location..."
          handleChange={(e) => changeField("place", e.target.value)}
          disabled={readOnly}
        >
          <div className="font-semibold">Session location</div>
        </TextInputElement>

        <TextInputElement
          name="startTime"
          value={input.startTime}
          placeholder="Enter session start time (e.g. 08:00)..."
          handleChange={(e) => changeField("startTime", e.target.value)}
          disabled={readOnly}
        >
          <div className="font-semibold">Start time</div>
        </TextInputElement>

        <TextInputElement
          name="endTime"
          value={input.endTime}
          placeholder="Enter session end time (e.g. 17:00)..."
          handleChange={(e) => changeField("endTime", e.target.value)}
          disabled={readOnly}
        >
          <div className="font-semibold">End time</div>
        </TextInputElement>

        <TextInputElement
          name="interval"
          value={input.interval}
          placeholder="Enter session interval (in days)..."
          handleChange={(e) => changeField("interval", e.target.value)}
          disabled={readOnly}
        >
          <div className="font-semibold">Interval</div>
          <div className="text-sm">
            There will be a session every this many days.
          </div>
        </TextInputElement>

        <TextInputElement
          name="startDate"
          value={input.startDate}
          placeholder="Enter session start date in dd/mm/yyyy format (e.g. 13/01/2024)..."
          handleChange={(e) => changeField("startDate", e.target.value)}
          disabled={readOnly}
        >
          <div className="font-semibold">Start date</div>
          <div className="text-sm">
            First instance of session will be on this date.
          </div>
        </TextInputElement>

        <TextInputElement
          name="endDate"
          value={input.endDate}
          placeholder="Enter session end date in dd/mm/yyyy format (e.g. 13/02/2024)..."
          handleChange={(e) => changeField("endDate", e.target.value)}
          disabled={readOnly}
        >
          <div className="font-semibold">End date</div>
          <div className="text-sm">
            Session will run until this date (inclusive).
          </div>
        </TextInputElement>
      </div>
    </div>
  );
}
