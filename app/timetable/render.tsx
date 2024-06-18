// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
"use client";
import { useCallback, useState } from "react";
import { OverviewCard } from "@/app/components/overview-card";
import { removeUserAttendance, updateUserAttendance } from "@/app/lib/actions";
import {
  EventId,
  ExtendedEvent,
  ExtendedSchedule,
  ScheduleId,
  User,
  UserId,
  UserWithStatus,
} from "@/app/lib/types";
import { Timetable } from "@/app/components/timetable";
import { FollowCard } from "@/app/components/follow-card";
export default function Render({
  currentUser,
  userFollows,
  userFollowers,
  attendanceLookup,
  eventLookup,
  scheduleLookup,
  userLookup,
}: {
  currentUser: User;
  userFollows: UserWithStatus[] | undefined;
  userFollowers: UserWithStatus[] | undefined;
  attendanceLookup: Map<EventId, Map<ScheduleId, UserId[]>>;
  eventLookup: Map<EventId, ExtendedEvent>;
  scheduleLookup: Map<ScheduleId, ExtendedSchedule>;
  userLookup: Map<UserId, User>;
}) {
  const attendanceMapInit: { [eventId: EventId]: ScheduleId } = {};
  const userEvents: ExtendedEvent[] = [];
  for (const [eventId, eventMap] of attendanceLookup.entries()) {
    for (const [scheduleId, users] of eventMap.entries()) {
      for (const userId of users)
        if (userId === currentUser.id) {
          attendanceMapInit[eventId] = scheduleId;
          const event = eventLookup.get(eventId);
          if (event) {
            userEvents.push(event);
          }
        }
    }
  }

  const [attendanceMap, setAttendanceMap] = useState(attendanceMapInit);
  const [activeEvent, setActiveEvent] = useState("");

  const handleAttendanceUpdate = useCallback(
    async (eventId: string, scheduleId: string) => {
      if (activeEvent == eventId) {
        setAttendanceMap((att) => {
          att[eventId] = scheduleId;
          return att;
        });
        updateUserAttendance(eventId, scheduleId);
        setActiveEvent("");
      } else {
        setActiveEvent(eventId);
      }
    },
    [activeEvent],
  );

  const modifiedAttendanceLookup: Map<
    EventId,
    Map<ScheduleId, UserId[]>
  > = new Map();

  for (const [eventId, eventMap] of attendanceLookup.entries()) {
    for (const [scheduleId, users] of eventMap.entries()) {
      for (const userId of users)
        if (userId !== currentUser.id) {
          if (!modifiedAttendanceLookup.get(eventId))
            modifiedAttendanceLookup.set(eventId, new Map());
          if (!modifiedAttendanceLookup.get(eventId)?.get(scheduleId))
            modifiedAttendanceLookup.get(eventId)?.set(scheduleId, []);
          modifiedAttendanceLookup.get(eventId)?.get(scheduleId)?.push(userId);
        } else {
          const currentScheduleId = attendanceMap[eventId];
          if (!modifiedAttendanceLookup.get(eventId))
            modifiedAttendanceLookup.set(eventId, new Map());
          if (!modifiedAttendanceLookup.get(eventId)?.get(currentScheduleId))
            modifiedAttendanceLookup.get(eventId)?.set(currentScheduleId, []);
          modifiedAttendanceLookup
            .get(eventId)
            ?.get(currentScheduleId)
            ?.push(userId);
        }
    }
  }

  return (
    <main className="flex h-full w-dvw flex-row space-x-2 px-2 py-2">
      <FollowCard
        currentUser={currentUser}
        userFollows={userFollows}
        userFollowers={userFollowers}
      />
      <Timetable
        currentUser={currentUser}
        attendanceLookup={modifiedAttendanceLookup}
        eventLookup={eventLookup}
        scheduleLookup={scheduleLookup}
        userLookup={userLookup}
        activeEvent={activeEvent}
        handleAttendanceUpdate={handleAttendanceUpdate}
      />
      <OverviewCard
        events={userEvents}
        attendanceMap={attendanceMap}
        activeEvent={activeEvent}
        handleAttendanceUpdate={handleAttendanceUpdate}
      />
    </main>
  );
}
// 3:50
// 1:40
