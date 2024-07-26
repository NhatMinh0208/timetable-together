import "@testing-library/jest-dom";
import * as db from "@/app/lib/db";
import { Event, Schedule, User } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { ExtendedEvent, ExtendedSchedule } from "@/app/lib/types";

// helper functions

function purgeId(
  event:
    | (ExtendedEvent & {
        owner: {
          id: string;
          name: string;
        };
      })
    | {
        id: string;
        name: string;
        owner: {
          name: string;
        };
      },
) {
  event.id = "";
  if ("id" in event.owner) {
    event.owner.id = "";
  }
  if ("schedules" in event) {
    for (const schedule of event.schedules) {
      schedule.id = "";
      for (const session of schedule.sessions) {
        session.id = "";
        (session as unknown as { scheduleId: string }).scheduleId = "";
      }
    }
  }
}

export async function createEventStandalone(
  event: ExtendedEvent,
  userId: string,
) {
  try {
    const insertedEvent = await db.insertEvent(
      userId,
      event.name,
      event.description,
      event.private,
    );
    for (const schedule of event.schedules) {
      const insertedSchedule = await db.insertSchedule(
        insertedEvent.id,
        schedule.name,
      );
      for (const session of schedule.sessions) {
        await db.insertSession(
          insertedSchedule.id,
          session.place,
          session.timeZone,
          session.startTime,
          session.endTime,
          session.startDate,
          session.endDate,
          session.interval,
        );
      }
    }
    return insertedEvent;
  } catch (error) {
    console.log(error);
  }
}

// test data

const testUsers: User[] = [
  {
    id: "",
    name: "user_f8f8fsdf0",
    email: "user22@test.example.com",
    password: "password",
  },
  {
    id: "",
    name: "用户_bcvnft908nf",
    email: "yonghu22@test.example.org",
    password: "mima1234",
  },
  {
    id: "",
    name: "người dùng_hjmghj09m",
    email: "nguoidung22@test.example.org",
    password: "matkhau1",
  },
];

const testEventsOwner = testUsers[0];

const testSchedule: ExtendedSchedule = {
  id: "",
  name: "Test Schedule #1",
  sessions: [
    {
      id: "",
      place: "Test Location",
      timeZone: "",
      interval: 7,
      startDate: new Date("2024-07-13"),
      endDate: new Date("2024-11-13"),
      startTime: new Date("2024-01-01 08:00"),
      endTime: new Date("2024-01-01 17:00"),
    },
  ],
};

const testEvents: ExtendedEvent[] = [
  {
    id: "",
    name: "CS9999 Introduction to Testing - Lecture (Sem 1)",
    description: "A test case for fetching an event with an exact name",
    private: false,
    schedules: [testSchedule],
  },
  {
    id: "",
    name: "CS9999 Introduction to Testing - Tutorial (Sem 1)",
    description: "A test case for fetching multiple events with a prefix",
    private: true,
    schedules: [testSchedule],
  },
  {
    id: "",
    name: "CS9999 Introduction to Testing - Tutorial (Sem 2)",
    description: "A test case for fetching multiple events with a prefix",
    private: true,
    schedules: [testSchedule],
  },
];

// initialization and cleanup for this suite

beforeAll(async () => {
  for (const test of testEvents) {
    const events = await db.getEventsFromName(
      test.name,
      20,
      true,
      testUsers[0].id,
    );
    for (const ev of events) await db.removeEvent(ev.id);
  }
  await prisma.user.deleteMany({
    where: {
      email: testUsers[0].email,
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: testUsers[1].email,
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: testUsers[2].email,
    },
  });
  const jobs: Promise<any>[] = [];
  testUsers.forEach((user) =>
    jobs.push(
      db
        .insertUser(user.email, user.name, user.password)
        .then((returnedUser) => (user.id = returnedUser?.id ?? user.id)),
    ),
  );

  await Promise.all(jobs);

  return await testEvents.forEach((event) =>
    jobs.push(
      createEventStandalone(event, testEventsOwner.id).then(
        (createdEvent) => (event.id = createdEvent?.id ?? event.id),
      ),
    ),
  );
}, 20000);

afterAll(async () => {
  const eventJobs: Promise<any>[] = [];
  testEvents.forEach((event) => {
    eventJobs.push(db.removeEvent(event.id));
  });
  await Promise.all(eventJobs);

  const jobs: Promise<any>[] = [];

  testUsers.forEach((user) => jobs.push(db.removeUser(user.id)));
  return await Promise.all(jobs);
}, 20000);

describe("Database users", () => {
  it("inserts, fetches and deletes a user", async () => {
    const testUser: User = {
      id: "",
      name: "TestUser123",
      email: "testuser@test.com",
      password: "sef098wq3912",
    };
    await db.insertUser(testUser.email, testUser.name, testUser.password);
    const insertedUser = await db.getUserFromEmail(testUser.email);
    expect(insertedUser).toBeTruthy();

    testUser.id = (insertedUser as User).id;
    expect(insertedUser).toEqual(testUser);

    await db.removeUser(testUser.id);
    const removedUser = await db.getUserFromEmail(testUser.email);
    expect(removedUser).toBeFalsy();
  }, 20000);

  it("fetches users based on exact name", async () => {
    const exactUsers = await db.getUsersFromNameOrEmail(
      testUsers[0].name,
      5,
      true,
    );
    for (const user of exactUsers) {
      expect(user.name).toBe(testUsers[0].name);
    }
  }, 20000);

  it("fetches results from multiple search strings", async () => {
    const result = await db.getUsersFromNameOrEmail(
      testUsers.map((user) => user.name),
      5,
      true,
    );
    for (const user of result) {
      user.id = "";
    }
    expect(result).toMatchSnapshot();
    const result2 = await db.getUsersFromNameOrEmail(
      testUsers.map((user) => user.name.split("_")[1]),
      5,
      false,
    );
    for (const user of result2) {
      user.id = "";
    }
    expect(result2).toMatchSnapshot();
  }, 20000);

  it("fetches users based on exact email", async () => {
    const exactUsers = await db.getUsersFromNameOrEmail(
      testUsers[0].email,
      5,
      true,
    );
    expect(exactUsers[0].id).toBe(testUsers[0].id);
  }, 20000);

  it("ignores non-exact email searches", async () => {
    const nonExactUsers = await db.getUsersFromNameOrEmail(
      "@test.example.org",
      5,
      false,
    );
    expect(nonExactUsers.map((user) => user.name).sort()).toEqual([]);
  }, 20000);
});

describe("Database events", () => {
  it("fetches an event with exact name", async () => {
    const eventName = testEvents[0].name;
    const res = await db.getEventsFromName(
      eventName,
      1,
      true,
      testEventsOwner.id,
    );
    expect(res.length).toBe(1);
    expect(res[0].name).toBe(eventName);
  }, 20000);

  it("fetches multiple events with prefix", async () => {
    const eventName = "CS9999 Introduction to Testing - Tutorial";
    const res = await db.getEventsFromName(
      eventName,
      5,
      false,
      testEventsOwner.id,
    );
    for (const event of res) {
      purgeId(event);
    }
    expect(res).toMatchSnapshot();
  }, 20000);

  it("fetches multiple events from id", async () => {
    const eventName = "CS9999 Introduction to Testing - Tutorial";
    const res = await db.getEventMany(testEvents.map((event) => event.id));
    for (const event of res) {
      purgeId(event);
    }
    expect(res).toMatchSnapshot();
  }, 20000);

  it("filters out events with no permission", async () => {
    const eventName = "CS9999 Introduction to Testing - Tutorial";
    const res = await db.getEventsFromName(eventName, 5, false, "");
    expect(res).toEqual([]);
  }, 20000);

  it("fetches multiple events with case insensitive words", async () => {
    const eventName = "cs9999 sem 1";
    const res = await db.getEventsFromName(
      eventName,
      5,
      false,
      testEventsOwner.id,
    );
    for (const event of res) {
      purgeId(event);
    }
    expect(res).toMatchSnapshot();
  }, 20000);
});

describe("Database attendances", () => {
  it("inserts, fetches and deletes an attendance", async () => {
    const testUser = (await db.getUserFromEmail(testUsers[1].email)) as User;
    const event = await db.getEventFull(testEvents[0].id);
    console.log(event);
    await db.insertAttendance(testUser.id, event.id, event.schedules[0]?.id);
    const attendances = await db.getAttendancesByUserIdMany([testUser.id]);
    expect(attendances).toContainEqual({
      attendeeId: testUser.id,
      eventId: event.id,
      scheduleId: event.schedules[0]?.id,
    });
    await db.removeAttendance(testUser.id, event.id);
    const newAttendances = await db.getAttendancesByUserIdMany([testUser.id]);
    expect(newAttendances).not.toContainEqual({
      attendeeId: testUser.id,
      eventId: event.id,
      scheduleId: event.schedules[0]?.id,
    });
  }, 20000);
});

describe("Database follows", () => {
  it("inserts, fetches and deletes a follow", async () => {
    await db.insertFollow(testUsers[0].id, testUsers[1].id);
    const res1 = await db.getFollowsByFollowerId(testUsers[0].id);
    for (const follow of res1) follow.id = "";
    expect(res1).toMatchSnapshot();
    await db.updateFollowStatus(testUsers[0].id, testUsers[1].id, "active");
    const res2 = await db.getFollowsByFollowedId(testUsers[1].id);
    for (const follow of res2) follow.id = "";
    expect(res2).toMatchSnapshot();
    await db.removeFollow(testUsers[0].id, testUsers[1].id);
    const res3 = await db.getFollowsByFollowerId(testUsers[0].id);
    for (const follow of res3) follow.id = "";
    expect(res3).toMatchSnapshot();
  }, 20000);
});

describe("Database notes", () => {
  it("inserts, fetches and deletes a note", async () => {
    const note = await db.insertNote(
      testUsers[0].id,
      "Test note",
      new Date("2024/01/01 12:00:00"),
      new Date("2024/01/01 11:00:00"),
    );
    await db.insertRecipients(note.id, [testUsers[0].id, testUsers[1].id]);
    const res1 = await db.getRecvNotes(testUsers[0].id);
    for (const note of res1 ?? []) {
      note.note.id = "";
      note.note.sender.id = "";
    }
    const res2 = await db.getRecvNotes(testUsers[1].id);
    for (const note of res2 ?? []) {
      note.note.id = "";
      note.note.sender.id = "";
    }
    expect(res1).toMatchSnapshot();
    expect(res2).toMatchSnapshot();
    await db.removeRecv(testUsers[0].id, note.id);
    const res3 = await db.getRecvNotes(testUsers[0].id);
    for (const note of res3 ?? []) {
      note.note.id = "";
      note.note.sender.id = "";
    }
    const res4 = await db.getRecvNotes(testUsers[1].id);
    for (const note of res4 ?? []) {
      note.note.id = "";
      note.note.sender.id = "";
    }
    expect(res3).toMatchSnapshot();
    expect(res4).toMatchSnapshot();
    await db.removeRecv(testUsers[1].id, note.id);
  }, 20000);
});
