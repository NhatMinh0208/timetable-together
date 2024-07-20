// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
// It will pass fetched data to the render component, which does the actual rendering of things.
import {
  getUserFollowers,
  getUserFollows,
  getUserRecvNotes,
  getEventManyChecked,
} from "@/app/lib/actions";
import Render from "./render";
import { auth } from "@/auth";
import {
  getAttendancesByUserIdMany,
  getEventsFromName,
  getUsersFromNameOrEmail,
} from "@/app/lib/db";
import {
  EventId,
  ExtendedEvent,
  ExtendedSchedule,
  ScheduleId,
  User,
  UserId,
} from "@/app/lib/types";
import { hashCode } from "@/app/lib/password";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    eventQuery?: string;
    userQuery?: string;
  };
}) {
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
  }

  const eventsToFetch: EventId[] = [];
  for (const eventId of attendanceLookup.keys()) eventsToFetch.push(eventId);
  const events = await getEventManyChecked(eventsToFetch);

  for (const event of events) {
    eventLookup.set(event.id, event);
    for (const schedule of event.schedules) {
      scheduleLookup.set(schedule.id, schedule);
    }
  }

  const eventSearchResults = searchParams?.eventQuery
    ? await getEventsFromName(
        searchParams?.eventQuery,
        5,
        false,
        session.user.id,
      )
    : [];
  const userSearchResults = searchParams?.userQuery
    ? await getUsersFromNameOrEmail(searchParams?.userQuery, 5, false)
    : [];

  const recvNotes = await getUserRecvNotes();
  return (
    <Render
      currentUser={currentUser}
      userFollows={userFollows}
      userFollowers={userFollowers}
      attendanceLookup={attendanceLookup}
      eventLookup={eventLookup}
      scheduleLookup={scheduleLookup}
      userLookup={userLookup}
      eventSearchResults={eventSearchResults}
      userSearchResults={userSearchResults}
      recvNotes={recvNotes}
      key={hashCode(attendances.join(" "))}
    />
  );
}
// 1:40
