import { TextInputElement } from "@/app/components/text-input-element";
import { EventInput, ScheduleInput } from "@/app/lib/types";
import { useState } from "react";
import { createEvent, CreateEventState } from "@/app/lib/actions";
import { ScheduleInputElement } from "./schedule-input-element";
import { createId10 } from "@/app/lib/cuid2";
import { convertEventInput } from "@/app/lib/input";

export function EventInputElement({
  initialInput,
  readOnly
}: {
  initialInput: EventInput;
  readOnly: boolean;
}) {
  const [state, setState] = useState<CreateEventState>({
    status: "",
    errors: [],
  });
  const [input, setInput] = useState(initialInput);
  const [waiting, setWaiting] = useState(false);

  function changeName(name: string) {
    setInput((input) => ({
      name: name,
      private: input.private,
      description: input.description,
      schedules: input.schedules,
    }));
  }
  function changeDescription(description: string) {
    setInput((input) => ({
      name: input.name,
      private: input.private,
      description: description,
      schedules: input.schedules,
    }));
  }
  function addSchedule() {
    setInput((input) => {
      const newSchedules = [];
      for (const schedule of input.schedules) {
        newSchedules.push(schedule);
      }
      newSchedules.push({
        id: createId10(),
        name: "",
        sessions: [],
      });
      return {
        name: input.name,
        private: input.private,
        description: input.description,
        schedules: newSchedules,
      };
    });
  }

  function changeSchedule(index: number, newSchedule: ScheduleInput) {
    setInput((input) => {
      const newSchedules: ScheduleInput[] = [];
      input.schedules.forEach((s, i) => {
        if (i == index) newSchedules.push(newSchedule);
        else newSchedules.push(s);
      });

      return {
        name: input.name,
        private: input.private,
        description: input.description,
        schedules: newSchedules,
      };
    });
  }

  function removeSchedule(index: number) {
    setInput((input) => {
      const newSchedules: ScheduleInput[] = [];
      input.schedules.forEach((s, i) => {
        if (i == index) {
        } else newSchedules.push(s);
      });

      return {
        name: input.name,
        private: input.private,
        description: input.description,
        schedules: newSchedules,
      };
    });
  }

  const submit = async () => {
    setWaiting(true);
    const state1: CreateEventState = {
      status: "",
      errors: [],
    };
    const event = convertEventInput(state1, input);
    if (state1.errors.length > 0) {
      setState(state1);
      setWaiting(false);
      return;
    }
    const newState = await createEvent(state, event);
    setState(newState);
    setWaiting(false);
  };

  return (
    <div className="space-y-2">
      <div className="max-h-[63dvh] space-y-2 overflow-auto">
        <div className="font-semibold">Event name</div>
        <TextInputElement
          name="name"
          value={input.name}
          placeholder="Enter event name..."
          handleChange={(e) => changeName(e.target.value)}
          disabled={readOnly}
        />
        <div className="font-semibold">Description</div>
        <TextInputElement
          name="description"
          value={input.description}
          placeholder="Enter description..."
          handleChange={(e) => changeDescription(e.target.value)}
          disabled={readOnly}
        />
        {input.schedules.map((schedule, i) => (
          <ScheduleInputElement
            key={schedule.id}
            index={i}
            schedule={schedule}
            changeSchedule={(newSchedule) => changeSchedule(i, newSchedule)}
            removeSchedule={() => removeSchedule(i)}
            readOnly={readOnly}
          />
        ))}
        <div className="flex flex-row justify-center">
          <button
            className="w-1/3 justify-center rounded-md bg-blue-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            type="button"
            onClick={addSchedule}
            hidden={readOnly}
          >
            Add schedule
          </button>
        </div>
      </div>

      <button
        onClick={submit}
        hidden={readOnly}
        className="w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Create event
      </button>

      <div>{waiting ? "Creating event..." : state.status}</div>

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
