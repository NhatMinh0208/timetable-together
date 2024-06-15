export type User = {
  id: string;
  email: string;
  name: string;
};

export type Session = {
  id: string;
  place: string;
  timeZone: string;
  startTime: Date;
  endTime: Date;
  startDate: Date;
  endDate: Date;
  interval: number;
  scheduleId: string;
};

export type Schedule = {
  id: string;
  name: string;
  eventId: string;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
};

export type Attendance = {
  attendeeId: string;
  eventId: string;
  scheduleId: string;
};

export type Follows = {
  followedById: string;
  followingId: string;
  pending: boolean;
};

export type ExtendedAttendanceSchedule = {
  id: string;
  name: string;
  sessions: Session[];
};

export type ExtendedAttendanceEvent = {
  id: string;
  name: string;
  schedules: ExtendedAttendanceSchedule[];
};

export type ExtendedAttendance = {
  scheduleId: string;
  attendeeId: string;
  event: ExtendedAttendanceEvent;
};

export type TimetableBlock = {
  eventId: string;
  scheduleId: string;
  eventName: string;
  scheduleName: string;
  startTime: Date;
  endTime: Date;
  place: string;
  isUser: boolean;
  isCurrent: boolean;
};
