// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
// It will pass fetched data to the render component, which does the actual rendering of things.
import { getUserFollowers, getUserFollows } from "@/app/lib/actions";
import Render from "./render";
import { auth } from "@/auth";
import { getAttendancesByUserIdMany, getEventMany } from "@/app/lib/db";
import {
  EventId,
  ExtendedEvent,
  ExtendedSchedule,
  ScheduleId,
  User,
  UserId,
} from "@/app/lib/types";

const hashCode = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export default async function Page() {
  const attendanceLookup: Map<EventId, Map<ScheduleId, UserId[]>> = new Map();
  const eventLookup: Map<EventId, ExtendedEvent> = new Map();
  const scheduleLookup: Map<ScheduleId, ExtendedSchedule> = new Map();
  const userLookup: Map<UserId, User> = new Map();

  const session = await auth();
  const userFollows = await getUserFollows();
  const userFollowers = await getUserFollowers();

  const usersToFetch: string[] = [];
  let currentUser: User | undefined = undefined;

  if (session && session.user && session.user.id) {
    usersToFetch.push(session.user.id);
    currentUser = {
      id: session.user.id,
      name: session.user.name ? session.user.name : "",
      email: session.user.email ? session.user.email : "",
    };

    userLookup.set(currentUser.id, currentUser);
  } else {
    throw new Error("User is not logged in");
  }

  if (userFollows)
    for (const follow of userFollows)
      if (follow.status == "active") {
        userLookup.set(follow.id, follow);
        usersToFetch.push(follow.id);
      }
  const attendances = await getAttendancesByUserIdMany(usersToFetch);

  for (const att of attendances) {
    if (!attendanceLookup.get(att.eventId))
      attendanceLookup.set(att.eventId, new Map());
    if (!attendanceLookup.get(att.eventId)?.get(att.scheduleId))
      attendanceLookup.get(att.eventId)?.set(att.scheduleId, []);
    attendanceLookup
      .get(att.eventId)
      ?.get(att.scheduleId)
      ?.push(att.attendeeId);

    console.log(att);
    console.log(attendanceLookup.get(att.eventId)?.get(att.scheduleId));
  }

  const eventsToFetch: EventId[] = [];
  for (const eventId of attendanceLookup.keys()) eventsToFetch.push(eventId);
  const events = await getEventMany(eventsToFetch);

  for (const event of events) {
    eventLookup.set(event.id, event);
    for (const schedule of event.schedules) {
      console.log(event);
      console.log(schedule);
      scheduleLookup.set(schedule.id, schedule);
    }
  }

  return (
    <Render
      currentUser={currentUser}
      userFollows={userFollows}
      userFollowers={userFollowers}
      attendanceLookup={attendanceLookup}
      eventLookup={eventLookup}
      scheduleLookup={scheduleLookup}
      userLookup={userLookup}
      key={hashCode(attendances.join(" "))}
    />
  );
}
// 1:00
