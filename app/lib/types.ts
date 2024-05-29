export interface User {
  id: String;
  email: String;
  name: String;
}

export interface Session {
  id: String;
  place: String;
  timeZone: String;
  startTime: Date;
  endTime: Date;
  startDate: Date;
  endDate: Date;
  interval: Number;
  alternativeId: String;
}

export interface Alternative {
  id: String;
  name: String;
  eventId: String;
}

export interface Event {
  id: String;
  name: String;
  description: String;
  ownerId: String;
}

export interface Attendance {
  attendeeId: String;
  eventId: String;
  alternativeId: String;
}

export interface Follows {
  followedById: String;
  followingId: String;
  pending: Boolean;
}
