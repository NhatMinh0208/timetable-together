import "@testing-library/jest-dom";
import * as db from "@/app/lib/db";
import { Event, Schedule, User } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import {
  ExtendedAttendance,
  ExtendedEvent,
  ExtendedSchedule,
} from "@/app/lib/types";

// helper functions

function purgeId(
  event:
    | ExtendedEvent
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
  if ("owner" in event && "id" in event.owner) {
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

function purgeIdAttendance(attendance: ExtendedAttendance) {
  attendance.attendeeId = "";
  purgeId(attendance.event);
  attendance.scheduleId = "";
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
      startDate: new Date(1720803600000),
      endDate: new Date(1731430800000),
      startTime: new Date(1704070800000),
      endTime: new Date(1704103200000),
    },
  ],
};
const testScheduleB: ExtendedSchedule = {
  id: "",
  name: "Test Schedule #2",
  sessions: [
    {
      id: "",
      place: "Test Location B",
      timeZone: "",
      interval: 7,
      startDate: new Date(1720803600000),
      endDate: new Date(1731430800000),
      startTime: new Date(1704070800000),
      endTime: new Date(1704103200000),
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
  {
    id: "",
    name: "CS1244 Multi-Schedule test",
    description: "A test case for updating attendance",
    private: false,
    schedules: [testSchedule, testScheduleB],
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

  it("fetches owned events", async () => {
    const res = await db.getOwnedEvents(testUsers[0].id, 20, 1);
    for (const event of res) {
      event.id = "";
      event.ownerId = "";
    }
    expect(res).toMatchSnapshot();
  });
});

describe("Database attendances", () => {
  it("inserts, fetches and deletes an attendance", async () => {
    const event0 = await db.getEventFull(testEvents[0].id);
    const event1 = await db.getEventFull(testEvents[1].id);
    await db.insertAttendance(
      testUsers[0].id,
      event0.id,
      event0.schedules[0]?.id,
    );
    await db.insertAttendance(
      testUsers[1].id,
      event1.id,
      event0.schedules[0]?.id,
    );
    const attendances1 = await db.getAttendancesByUserId(testUsers[0].id);
    for (const x of attendances1) purgeIdAttendance(x);
    expect(attendances1).toMatchSnapshot();
    const attendances2 = await db.getAttendancesByUserIdMany([
      testUsers[0].id,
      testUsers[1].id,
    ]);
    expect(attendances2).toContainEqual({
      attendeeId: testUsers[0].id,
      eventId: event0.id,
      scheduleId: event0.schedules[0]?.id,
    });
    expect(attendances2).toContainEqual({
      attendeeId: testUsers[1].id,
      eventId: event1.id,
      scheduleId: event0.schedules[0]?.id,
    });
    await db.removeAttendance(testUsers[0].id, event0.id);
    await db.removeAttendance(testUsers[1].id, event1.id);
    const attendances3 = await db.getAttendancesByUserIdMany([
      testUsers[0].id,
      testUsers[1].id,
    ]);
    expect(attendances3).toEqual([]);
  }, 20000);

  it("updates attendances", async () => {
    const event3 = await db.getEventFull(testEvents[3].id);
    await db.insertAttendance(
      testUsers[0].id,
      event3.id,
      event3.schedules[0]?.id,
    );
    const attendances1 = await db.getAttendancesByUserId(testUsers[0].id);
    for (const x of attendances1)
      expect(x.scheduleId).toEqual(event3.schedules[0]?.id);
    await db.updateAttendance(
      testUsers[0].id,
      event3.id,
      event3.schedules[1]?.id,
    );
    const attendances2 = await db.getAttendancesByUserId(testUsers[0].id);
    for (const x of attendances2)
      expect(x.scheduleId).toEqual(event3.schedules[1]?.id);
    await db.removeAttendance(testUsers[0].id, event3.id);
  });
});

describe("Database follows", () => {
  it("inserts, fetches and deletes a follow", async () => {
    await db.insertFollow(testUsers[0].id, testUsers[1].id);
    const res1a = await db.getFollowsByFollowerId(testUsers[0].id);
    const res1b = await db.hasRelationship(testUsers[0].id, testUsers[1].id);
    for (const follow of res1a) follow.id = "";
    expect(res1a).toMatchSnapshot();
    expect(res1b).toEqual(false);
    await db.updateFollowStatus(testUsers[0].id, testUsers[1].id, "active");
    const res2a = await db.getFollowsByFollowedId(testUsers[1].id);
    const res2b = await db.hasRelationship(testUsers[0].id, testUsers[1].id);
    for (const follow of res2a) follow.id = "";
    expect(res2a).toMatchSnapshot();
    expect(res2b).toEqual(true);
    await db.removeFollow(testUsers[0].id, testUsers[1].id);
    const res3a = await db.getFollowsByFollowerId(testUsers[0].id);
    const res3b = await db.hasRelationship(testUsers[0].id, testUsers[1].id);
    for (const follow of res3a) follow.id = "";
    expect(res3a).toMatchSnapshot();
    expect(res3b).toEqual(false);
  }, 20000);
});

describe("Database notes", () => {
  it("inserts, fetches and deletes a note", async () => {
    const note = await db.insertNote(
      testUsers[0].id,
      "Test note",
      new Date(1704085200000),
      new Date(1704081600000),
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
