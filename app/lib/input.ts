import {
  EventInput,
  ExtendedEvent,
  ExtendedSchedule,
  ScheduleInput,
  Session,
  SessionInput,
} from "@/app/lib/types";
import { eventSchema, scheduleSchema, sessionSchema } from "@/app/lib/zod";
import { CreateEventState } from "@/app/lib/actions";
import { ZodError } from "zod";
import { errorToJSON } from "next/dist/server/render";

export function convertSessionInput(
  state: CreateEventState,
  input: SessionInput,
  schedule: string,
  session: number,
): Session {
  try {
    const parseResult = sessionSchema.parse(input);
  } catch (e) {
    if (e instanceof ZodError) {
      for (const err of e.errors) {
        state.errors.push(
          "Schedule " +
            schedule +
            ", session #" +
            session.toString() +
            ": " +
            err.message,
        );
      }
    }
  }
  const [startDay, startMonth, startYear] = input.startDate
    .split("/")
    .map((s) => parseInt(s, 10));
  const [endDay, endMonth, endYear] = input.endDate
    .split("/")
    .map((s) => parseInt(s, 10));
  return {
    id: "",
    place: input.place,
    timeZone: input.timeZone,
    startDate: new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0),
    endDate: new Date(endYear, endMonth - 1, endDay, 0, 0, 0, 0),
    startTime: new Date("01/01/2024 " + input.startTime),
    endTime: new Date("01/01/2024 " + input.endTime),
    interval: parseInt(input.interval),
  };
}

function convertScheduleInput(
  state: CreateEventState,
  input: ScheduleInput,
): ExtendedSchedule {
  try {
    const parseResult = scheduleSchema.parse(input);
  } catch (e) {
    if (e instanceof ZodError) {
      for (const err of e.errors) {
        state.errors.push("Schedule " + input.name + ": " + err.message);
      }
    }
  }
  return {
    id: "",
    name: input.name,
    sessions: input.sessions.map((x, i) =>
      convertSessionInput(state, x, input.name, i + 1),
    ),
  };
}

export function convertEventInput(
  state: CreateEventState,
  input: EventInput,
): ExtendedEvent {
  try {
    const parseResult = eventSchema.parse(input);
  } catch (e) {
    if (e instanceof ZodError) {
      for (const err of e.errors) {
        state.errors.push(err.message);
      }
    }
  }
  return {
    id: "",
    name: input.name,
    description: input.description,
    private: input.private,
    schedules: input.schedules.map((x) => convertScheduleInput(state, x)),
  };
}

function pad(s: string, digits: number) {
  let res = s;
  while (res.length < digits) {
    res = "0" + res;
  }
  return res;
}

function convertSessionToInput(session: Session): SessionInput {
  return {
    id: session.id,
    place: session.place,
    timeZone: session.timeZone,
    startDate:
      pad(session.startDate.getDate().toString(), 2) +
      "/" +
      pad((session.startDate.getMonth() + 1).toString(), 2) +
      "/" +
      session.startDate.getFullYear().toString(),
    endDate:
      pad(session.endDate.getDate().toString(), 2) +
      "/" +
      pad((session.endDate.getMonth() + 1).toString(), 2) +
      "/" +
      session.endDate.getFullYear().toString(),
    startTime:
      pad(session.startTime.getHours().toString(), 2) +
      ":" +
      pad(session.startTime.getMinutes().toString(), 2),
    endTime:
      pad(session.endTime.getHours().toString(), 2) +
      ":" +
      pad(session.endTime.getMinutes().toString(), 2),
    interval: session.interval.toString(),
  };
}

function convertScheduleToInput(schedule: ExtendedSchedule): ScheduleInput {
  return {
    id: schedule.id,
    name: schedule.name,
    sessions: schedule.sessions.map(convertSessionToInput),
  };
}

export function convertEventToInput(event: ExtendedEvent): EventInput {
  return {
    name: event.name,
    description: event.description,
    private: event.private,
    schedules: event.schedules.map(convertScheduleToInput),
  };
}
