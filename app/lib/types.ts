import { STATUS_ACTIVE, STATUS_PENDING } from "@/app/lib/constants";

export type User = {
  id: string;
  email: string;
  name: string;
};

export type UserWithStatus = User & {
  status: FollowStatus;
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

export type ExtendedSchedule = {
  id: string;
  name: string;
  sessions: Session[];
};

export type ExtendedEvent = {
  id: string;
  name: string;
  schedules: ExtendedSchedule[];
};

export type ExtendedAttendance = {
  scheduleId: string;
  attendeeId: string;
  event: ExtendedEvent;
};

export type TimetableBlock = {
  eventId: string;
  scheduleId: string;
  eventName: string;
  scheduleName: string;
  startTime: Date;
  endTime: Date;
  place: string;
  isCurrentUser: boolean;
  eventIsActive: boolean;
  users: string[];
};

export type EventId = string;
export type ScheduleId = string;
export type UserId = string;
export type FollowStatus = "pending" | "active";
