import { TextInputElement } from "@/app/components/text-input-element";
import { EventInput, ScheduleInput, SessionInput } from "@/app/lib/types";
import { useState } from "react";
import {
  createEvent,
  CreateEventState,
  createPrivateSession,
} from "@/app/lib/actions";
import { ScheduleInputElement } from "./schedule-input-element";
import { createId10 } from "../lib/cuid2";
import { SessionInputElement } from "./session-input-element";

export function PrivateSessionInputElement({
  readOnly,
}: {
  readOnly: boolean;
}) {
  const initialInput: SessionInput = {
    id: createId10(),
    place: "",
    timeZone: "",
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    interval: "",
  };

  const [state, setState] = useState<CreateEventState>({
    status: "",
    errors: [],
  });
  const [input, setInput] = useState(initialInput);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [waiting, setWaiting] = useState(false);

  const submit = async () => {
    setWaiting(true);
    const newState = await createPrivateSession(
      state,
      input,
      name,
      description,
    );
    setState(newState);
    setWaiting(false);
  };

  return (
    <div className="space-y-2">
      <div className="max-h-[63dvh] space-y-2 overflow-auto">
        <TextInputElement
          name="name"
          value={name}
          placeholder="Enter session name..."
          handleChange={(e) => setName(e.target.value)}
          disabled={readOnly}
        >
          <div className="font-semibold">Session name</div>
        </TextInputElement>

        <TextInputElement
          name="description"
          value={description}
          placeholder="Enter description..."
          handleChange={(e) => setDescription(e.target.value)}
          disabled={readOnly}
        >
          <div className="font-semibold">Description</div>
        </TextInputElement>

        <SessionInputElement
          index={0}
          session={input}
          changeSession={setInput}
          removeSession={() => {}}
          readOnly={readOnly}
        />
      </div>

      <button
        onClick={submit}
        hidden={readOnly}
        className="w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Create session
      </button>

      <div>{waiting ? "Creating session..." : state.status}</div>

      <div className="max-h-[12dvh] overflow-auto">
        <div className="overflow-hidden">
          {state.errors.map((error, i) => (
            <div key={i} hidden={waiting}>
              {error}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
