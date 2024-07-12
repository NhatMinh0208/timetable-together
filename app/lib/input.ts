import {
  EventInput,
  ExtendedEvent,
  ExtendedSchedule,
  ScheduleInput,
  Session,
  SessionInput,
} from "@/app/lib/types";

function convertSessionInput(input: SessionInput): Session {
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

function convertScheduleInput(input: ScheduleInput): ExtendedSchedule {
  return {
    id: "",
    name: input.name,
    sessions: input.sessions.map(convertSessionInput),
  };
}

export function convertEventInput(input: EventInput): ExtendedEvent {
  console.log(input);
  return {
    id: "",
    name: input.name,
    description: input.description,
    schedules: input.schedules.map(convertScheduleInput),
  };
}
