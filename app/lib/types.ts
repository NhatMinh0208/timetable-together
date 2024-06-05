export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Session {
  id: string;
  place: string;
  timeZone: string;
  startTime: Date;
  endTime: Date;
  startDate: Date;
  endDate: Date;
  interval: number;
  scheduleId: string;
}

export interface Schedule {
  id: string;
  name: string;
  eventId: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  ownerId: string;
}

export interface Attendance {
  attendeeId: string;
  eventId: string;
  scheduleId: string;
}

export interface Follows {
  followedById: string;
  followingId: string;
  pending: boolean;
}
