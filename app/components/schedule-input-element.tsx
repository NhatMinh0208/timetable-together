import { ScheduleInput, SessionInput } from "@/app/lib/types";
import { useState } from "react";
import { createId10 } from "@/app/lib/cuid2";
import { TextInputElement } from "@/app/components/text-input-element";

import RightArrow from "@/app/static/right-arrow.svg";

import DownArrow from "@/app/static/down-arrow.svg";
import Image from "next/image";
import { SessionInputElement } from "./session-input-element";

export function ScheduleInputElement({
  index,
  schedule,
  changeSchedule,
  removeSchedule,
  readOnly,
}: {
  index: number;
  schedule: ScheduleInput;
  changeSchedule: (schedule: ScheduleInput) => void;
  removeSchedule: () => void;
  readOnly: boolean;
}) {
  const initialInput: ScheduleInput = schedule;
  const [input, setInput] = useState(initialInput);
  const [hidden, setHidden] = useState(readOnly);
  const toggleHidden = () => setHidden((hidden) => !hidden);

  function changeName(name: string) {
    setInput((input) => {
      const newSchedule = {
        id: input.id,
        name: name,
        sessions: input.sessions,
      };
      changeSchedule(newSchedule);
      return newSchedule;
    });
  }

  function addSession() {
    setInput((input) => {
      const newSessions: SessionInput[] = [];
      input.sessions.forEach((session) => newSessions.push(session));
      newSessions.push({
        id: createId10(),
        place: "",
        timeZone: "",
        startTime: "",
        endTime: "",
        startDate: "",
        endDate: "",
        interval: "",
      });
      const newSchedule = {
        id: input.id,
        name: input.name,
        sessions: newSessions,
      };
      changeSchedule(newSchedule);
      return newSchedule;
    });
  }

  function changeSession(index: number, newSession: SessionInput) {
    setInput((input) => {
      const newSessions: SessionInput[] = [];
      input.sessions.forEach((s, i) => {
        if (i == index) newSessions.push(newSession);
        else newSessions.push(s);
      });

      const newSchedule = {
        id: input.id,
        name: input.name,
        sessions: newSessions,
      };
      changeSchedule(newSchedule);
      return newSchedule;
    });
  }

  function removeSession(index: number) {
    setInput((input) => {
      const newSessions: SessionInput[] = [];
      input.sessions.forEach((s, i) => {
        if (i == index) {
        } else newSessions.push(s);
      });

      const newSchedule = {
        id: input.id,
        name: input.name,
        sessions: newSessions,
      };
      changeSchedule(newSchedule);
      return newSchedule;
    });
  }
  return (
    <div className="space-y-2">
      <div
        className="w-full flex flex-row align-center rounded-md font-semibold bg-blue-300 px-1 h-10"
        onClick={(e) => toggleHidden()}
      >
        {hidden ? (
          <Image className="py-1" src={RightArrow} alt="" />
        ) : (
          <Image src={DownArrow} alt="" />
        )}
        <div className="w-2"></div>
        <div className="py-1 h-full grow text-left">
          Schedule {input.name !== "" ? input.name : "#" + (index + 1)}
        </div>
        <button
          onClick={removeSchedule}
          hidden={readOnly}
          className="justify-center rounded-md bg-red-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Remove
        </button>
      </div>

      <div className="px-6 space-y-2" hidden={hidden}>
        <div className="font-semibold">Schedule name</div>
        <TextInputElement
          name="name"
          value={input.name}
          placeholder="Enter schedule name..."
          handleChange={(e) => changeName(e.target.value)}
          disabled={readOnly}
        />

        {input.sessions.map((session, i) => (
          <SessionInputElement
            key={session.id}
            index={i}
            session={session}
            changeSession={(newSession) => changeSession(i, newSession)}
            removeSession={() => removeSession(i)}
            readOnly={readOnly}
          />
        ))}

        <div className="flex flex-row justify-center">
          <button
            className="w-1/4 justify-center rounded-md bg-purple-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            type="button"
            onClick={addSession}
            hidden={readOnly}
          >
            Add session
          </button>
        </div>
      </div>
    </div>
  );
}
