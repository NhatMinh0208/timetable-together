export interface Session {
  id: string;
  place: string;
  startTime: Date;
  endTime: Date;
  startDate: Date;
  endDate: Date;
  interval: number;
}

export interface Schedule {
  id: string;
  name: string;
  sessions: Session[];
}

export interface Event {
  id: string;
  name: string;
  description: string;
  schedules: Schedule[];
}

const sample_session_1: Session = {
  id: "arq3rf",
  place: "LT11",
  startTime: new Date("2024/01/01 16:00:00 +0800"),
  endTime: new Date("2024/01/01 18:00:00 +0800"),
  startDate: new Date("2024/01/15 00:00:00 +0800"),
  endDate: new Date("2024/05/31 00:00:00 +0800"),
  interval: 7,
};
const sample_session_2: Session = {
  id: "b31513",
  place: "LT11",
  startTime: new Date("2024/01/01 09:00:00 +0800"),
  endTime: new Date("2024/01/01 11:00:00 +0800"),
  startDate: new Date("2024/01/17 00:00:00 +0800"),
  endDate: new Date("2024/05/31 00:00:00 +0800"),
  interval: 7,
};
const sample_session_3: Session = {
  id: "x136t",
  place: "Online",
  startTime: new Date("2024/01/01 16:00:00 +0800"),
  endTime: new Date("2024/01/01 18:00:00 +0800"),
  startDate: new Date("2024/01/15 00:00:00 +0800"),
  endDate: new Date("2024/05/31 00:00:00 +0800"),
  interval: 7,
};
const sample_session_4: Session = {
  id: "d236t32",
  place: "Online",
  startTime: new Date("2024/01/01 09:00:00 +0800"),
  endTime: new Date("2024/01/01 11:00:00 +0800"),
  startDate: new Date("2024/01/17 00:00:00 +0800"),
  endDate: new Date("2024/05/31 00:00:00 +0800"),
  interval: 7,
};

const sample_schedule_1: Schedule = {
  id: "ufr304f",
  name: "01",
  sessions: [sample_session_1, sample_session_2],
};

const sample_schedule_2: Schedule = {
  id: "m324cf",
  name: "02",
  sessions: [sample_session_3, sample_session_4],
};

const sample_event_1: Event = {
  id: "d9120d12d",
  name: "CS2040S Data Structures and Algorithms - Lecture",
  description:
    "This course introduces students to the design\
and implementation of fundamental data structures and algorithms. \
The course covers basic data structures (linked lists, stacks, queues, \
hash tables, binary heaps, trees, and graphs), searching and sorting \
algorithms, and basic analysis of algorithms.",
  schedules: [sample_schedule_1, sample_schedule_2],
};

const sample_session_5: Session = {
  id: "hg3405tg3",
  place: "COM1-0113",
  startTime: new Date("2024/01/01 09:00:00 +0800"),
  endTime: new Date("2024/01/01 10:00:00 +0800"),
  startDate: new Date("2024/01/15 00:00:00 +0800"),
  endDate: new Date("2024/05/31 00:00:00 +0800"),
  interval: 7,
};

const sample_session_6: Session = {
  id: "zc890sd",
  place: "COM1-0113",
  startTime: new Date("2024/01/01 12:00:00 +0800"),
  endTime: new Date("2024/01/01 13:00:00 +0800"),
  startDate: new Date("2024/01/15 00:00:00 +0800"),
  endDate: new Date("2024/05/31 00:00:00 +0800"),
  interval: 7,
};

const sample_session_7: Session = {
  id: "cxvb789",
  place: "COM1-0113",
  startTime: new Date("2024/01/01 13:00:00 +0800"),
  endTime: new Date("2024/01/01 14:00:00 +0800"),
  startDate: new Date("2024/01/15 00:00:00 +0800"),
  endDate: new Date("2024/05/31 00:00:00 +0800"),
  interval: 7,
};

const sample_schedule_3: Schedule = {
  id: "hd0vcx0",
  name: "01",
  sessions: [sample_session_5],
};

const sample_schedule_4: Schedule = {
  id: "9f08dfb",
  name: "02",
  sessions: [sample_session_6],
};
const sample_schedule_5: Schedule = {
  id: "zxzc87",
  name: "03",
  sessions: [sample_session_7],
};

const sample_event_2: Event = {
  id: "fgnfgn0",
  name: "CS2100 Computer Organisation - Tutorial",
  description:
    "The objective of this course is to familiarise students \
with the fundamentals of computing devices. Through this course students \
will understand the basics of data representation, and how the various \
parts of a computer work, separately and with each other. This allows \
students to understand the issues in computing devices, and how these \
issues affect the implementation of solutions. Topics covered include \
data representation systems, combinational and sequential circuit design \
techniques, assembly language, processor execution cycles, pipelining, memory \
hierarchy and input/output systems.",
  schedules: [sample_schedule_3, sample_schedule_4, sample_schedule_5],
};

export const sampleEvents = [sample_event_1, sample_event_2];

const sample_attendance_1 = {
  attendeeId: "1",
  eventId: "d9120d12d",
  scheduleId: "ufr304f",
};
const sample_attendance_2 = {
  attendeeId: "1",
  eventId: "fgnfgn0",
  scheduleId: "9f08dfb",
};

export const sampleAttendances = [sample_attendance_1, sample_attendance_2];
