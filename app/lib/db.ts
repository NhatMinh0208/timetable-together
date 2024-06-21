"use server";

import { Attendance } from "@prisma/client";
import { createId10 } from "@/app/lib/cuid2";
import {
  ExtendedAttendance,
  FollowStatus,
  UserWithStatus,
} from "@/app/lib/types";

import { prisma } from "@/app/lib/prisma";

export async function getUserFromEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}
export async function getUsersFromNameOrEmail(
  query: string,
  limit: number,
  exact: boolean,
) {
  const filterName = exact
    ? {
        name: query,
      }
    : {
        name: {
          contains: query,
        },
      };
  const filterEmail = exact
    ? {
        email: query,
      }
    : {
        email: {
          contains: query,
        },
      };
  return await prisma.user.findMany({
    where: {
      OR: [filterName, filterEmail],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: limit,
  });
}

export async function insertUser(
  email: string,
  name: string,
  password: string,
) {
  try {
    await prisma.user.create({
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
        name: {
          contains: name,
        },
      };
  return await prisma.event.findMany({
    where: filter,
    select: {
      id: true,
      name: true,
      schedules: true,
    },
    take: limit,
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
