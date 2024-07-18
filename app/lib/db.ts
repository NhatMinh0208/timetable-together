"use server";

import { Attendance } from "@prisma/client";
import { createId10, createId16 } from "@/app/lib/cuid2";
import {
  ExtendedAttendance,
  FollowStatus,
  UserWithStatus,
} from "@/app/lib/types";

import { prisma } from "@/app/lib/prisma";
import { string } from "zod";

export async function getUserFromEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}
export async function getUsersFromNameOrEmail(
  query: string | string[],
  limit: number,
  exact: boolean,
) {
  if (typeof query == "string") {
    const filterName = exact
      ? {
          name: query,
        }
      : {
          name: {
            contains: query,
          },
        };

    const filterEmail = {
      email: query,
    };
    return await prisma.user.findMany({
      where: {
        OR: [filterName, filterEmail],
      },
      select: {
        id: true,
        name: true,
      },
      take: limit,
    });
  } else {
    const filterName = exact
      ? {
          OR: query.map((q) => ({
            name: q,
          })),
        }
      : {
          OR: query.map((q) => ({
            name: {
              contains: q,
            },
          })),
        };

    const filterEmail = {
      OR: query.map((q) => ({
        email: q,
      })),
    };
    return await prisma.user.findMany({
      where: {
        OR: [filterName, filterEmail],
      },
      select: {
        id: true,
        name: true,
      },
      take: limit,
    });
  }
}

export async function insertUser(
  email: string,
  name: string,
  password: string,
) {
  try {
    return await prisma.user.create({
      data: {
        id: createId10(),
        email: email,
        name: name,
        password: password,
      },
    });
  } catch (error) {
    console.log("Database error!");
    console.log(error);
  }
}

export async function removeUser(id: string) {
  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log("Database error!");
    console.log(error);
  }
}

export async function getEventsFromName(
  name: string,
  limit: number,
  exact: boolean,
) {
  const filter = exact
    ? {
        name: name,
      }
    : {
        AND: name.split(/\s+/).map((word) => ({
          name: {
            contains: word,
            mode: "insensitive" as "default" | "insensitive",
          },
        })),
      };
  return await prisma.event.findMany({
    where: filter,
    select: {
      id: true,
      name: true,
      schedules: true,
      owner: {
        select: {
          name: true,
        },
      },
    },
    take: limit,
  });
}

export async function getEvent(id: string) {
  return await prisma.event.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      ownerId: true,
    },
  });
}

export async function getEventFull(id: string) {
  return await prisma.event.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      schedules: {
        select: {
          id: true,
          name: true,
          sessions: true,
        },
      },
      owner: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function getEventMany(eventIds: string[]) {
  const criteria = eventIds.map((id) => ({
    id: id,
  }));

  return await prisma.event.findMany({
    where: {
      OR: criteria,
    },
    select: {
      id: true,
      name: true,
      description: true,
      schedules: {
        select: {
          id: true,
          name: true,
          sessions: true,
        },
      },
    },
  });
}

export async function getOwnedEvents(
  userId: string,
  count: number,
  page: number,
) {
  const res = (
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        ownedEvents: {
          orderBy: {
            name: "asc",
          },
          take: count,
          skip: (page - 1) * count,
        },
      },
    })
  )?.ownedEvents;
  if (!res) throw new Error("User not found");
  return res;
}

export async function getAttendance(userId: string, eventId: string) {
  return await prisma.attendance.findUnique({
    where: {
      attendeeId_eventId: {
        attendeeId: userId,
        eventId: eventId,
      },
    },
  });
}

export async function insertEvent(
  ownerId: string,
  name: string,
  description: string,
) {
  const id = await createId10();
  return await prisma.event.create({
    data: {
      id: id,
      name: name,
      description: description,
      ownerId: ownerId,
    },
  });
}

export async function insertSchedule(eventId: string, name: string) {
  const id = await createId16();
  return await prisma.schedule.create({
    data: {
      id: id,
      name: name,
      eventId: eventId,
    },
  });
}

export async function insertSession(
  scheduleId: string,
  place: string,
  timeZone: string,
  startTime: Date,
  endTime: Date,
  startDate: Date,
  endDate: Date,
  interval: number,
) {
  const id = await createId16();
  return await prisma.session.create({
    data: {
      id: id,
      place: place,
      timeZone: timeZone,
      startTime: startTime,
      endTime: endTime,
      startDate: startDate,
      endDate: endDate,
      interval: interval,
      scheduleId: scheduleId,
    },
  });
}

export async function removeEvent(id: string) {
  return await prisma.event.delete({
    where: {
      id: id,
    },
  });
}

export async function insertAttendance(
  userId: string,
  eventId: string,
  scheduleId: string,
) {
  return await prisma.attendance.create({
    data: {
      attendeeId: userId,
      eventId: eventId,
      scheduleId: scheduleId,
    },
  });
}

export async function updateAttedance(
  userId: string,
  eventId: string,
  scheduleId: string,
) {
  return await prisma.attendance.update({
    where: {
      attendeeId_eventId: {
        attendeeId: userId,
        eventId: eventId,
      },
    },
    data: {
      scheduleId: scheduleId,
    },
  });
}

export async function removeAttendance(userId: string, eventId: string) {
  return await prisma.attendance.delete({
    where: {
      attendeeId_eventId: {
        attendeeId: userId,
        eventId: eventId,
      },
    },
  });
}

export async function getAttendancesByUserId(
  userId: string,
): Promise<ExtendedAttendance[]> {
  return await prisma.attendance.findMany({
    where: {
      attendeeId: userId,
    },
    select: {
      event: {
        select: {
          id: true,
          name: true,
          description: true,
          schedules: {
            select: {
              id: true,
              name: true,
              sessions: true,
            },
          },
        },
      },
      scheduleId: true,
      attendeeId: true,
    },
    orderBy: {
      event: {
        name: "asc",
      },
    },
  });
}

export async function getAttendancesByUserIdMany(
  userIds: string[],
): Promise<Attendance[]> {
  const criteria = userIds.map((id) => ({
    attendeeId: id,
  }));

  return await prisma.attendance.findMany({
    where: {
      OR: criteria,
    },
  });
}

export async function getFollowsByFollowerId(userId: string) {
  const follows = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      followedBy: {
        select: {
          following: true,
          status: true,
        },
      },
    },
  });
  return follows
    ? follows.followedBy.map((x) => ({
        id: x.following.id,
        name: x.following.name,
        email: x.following.email,
        status: x.status as FollowStatus,
      }))
    : [];
}

export async function getFollowsByFollowedId(
  userId: string,
): Promise<UserWithStatus[]> {
  const follows = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      following: {
        select: {
          followedBy: true,
          status: true,
        },
      },
    },
  });
  return follows
    ? follows.following.map((x) => ({
        id: x.followedBy.id,
        name: x.followedBy.name,
        email: x.followedBy.email,
        status: x.status as FollowStatus,
      }))
    : [];
}

export async function getFollow(followerId: string, followedId: string) {
  const follows = await prisma.follows.findUnique({
    where: {
      followingId_followedById: {
        followingId: followedId,
        followedById: followerId,
      },
    },
  });
  return follows;
}

export async function insertFollow(followerId: string, followedId: string) {
  return await prisma.follows.create({
    data: {
      followingId: followedId,
      followedById: followerId,
    },
  });
}

export async function removeFollow(followerId: string, followedId: string) {
  return await prisma.follows.delete({
    where: {
      followingId_followedById: {
        followingId: followedId,
        followedById: followerId,
      },
    },
  });
}

export async function updateFollowStatus(
  followerId: string,
  followedId: string,
  status: FollowStatus,
) {
  return await prisma.follows.update({
    where: {
      followingId_followedById: {
        followingId: followedId,
        followedById: followerId,
      },
    },
    data: {
      status: status,
    },
  });
}

export async function getRecvNotes(userId: string) {
  const res = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      recvNotes: {
        select: {
          note: {
            select: {
              id: true,
              sender: {
                select: {
                  id: true,
                  name: true,
                },
              },
              content: true,
              position: true,
              timeSent: true,
            },
          },
          read: true,
        },
        orderBy: {
          note: {
            timeSent: "desc",
          },
        },
      },
    },
  });
  return res?.recvNotes;
}

export async function updateNoteRead(userId: string, noteId: string) {
  const res = await prisma.recipient.update({
    where: {
      noteId_userId: {
        userId: userId,
        noteId: noteId,
      },
    },
    data: {
      read: true,
    },
  });
  return res;
}

export async function removeNote(recvId: string, noteId: string) {
  const res = await prisma.recipient.delete({
    where: {
      noteId_userId: {
        userId: recvId,
        noteId: noteId,
      },
    },
  });
  return res;
}

export async function insertNote(
  senderId: string,
  content: string,
  position: Date,
  timeSent: Date,
) {
  return await prisma.note.create({
    data: {
      id: createId16(),
      senderId: senderId,
      content: content,
      position: position,
      timeSent: timeSent,
    },
  });
}

export async function insertRecipients(noteId: string, recvIds: string[]) {
  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
    },
  });
  if (!note) {
    throw new Error("Note not found");
  }
  const recipients = recvIds.map((recvId) => ({
    noteId: noteId,
    userId: recvId,
    read: recvId === note.senderId,
  }));
  return await prisma.recipient.createMany({
    data: recipients,
  });
}

export async function hasRelationship(userId1: string, userId2: string) {
  const rel12 = await prisma.follows.findUnique({
    where: {
      followingId_followedById: {
        followedById: userId1,
        followingId: userId2,
      },
      status: "active",
    },
  });
  const rel21 = await prisma.follows.findUnique({
    where: {
      followingId_followedById: {
        followedById: userId2,
        followingId: userId1,
      },
      status: "active",
    },
  });
  if (rel12 || rel21) return true;
  else return false;
}
