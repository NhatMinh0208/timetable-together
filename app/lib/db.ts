"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { createId10 } from "@/app/lib/cuid2";
import { ExtendedAttendance } from "@/app/lib/types";
const prisma = new PrismaClient();

export async function getUserFromDb(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

export async function insertUserToDb(
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

export async function getEventFromName(name: string) {
  return await prisma.event.findFirst({
    where: {
      name: name,
    },
    select: {
      id: true,
      name: true,
      schedules: {
        select: {
          id: true,
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
