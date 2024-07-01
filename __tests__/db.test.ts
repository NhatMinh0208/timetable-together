import "@testing-library/jest-dom";
import * as db from "@/app/lib/db";
import { Event, User } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";

// test data

const testUsers: User[] = [
  {
    id: "",
    name: "user",
    email: "user@test.example.com",
    password: "password",
  },
  {
    id: "",
    name: "用户",
    email: "yonghu@test.example.org",
    password: "mima1234",
  },
  {
    id: "",
    name: "người dùng",
    email: "nguoidung@test.example.org",
    password: "matkhau1",
  },
];

const testEventsOwner: User = {
  id: "azp3d9mvgp",
  name: "test events owner",
  email: "testeventsowner@test.example.net",
  password: "testeventsownerpassword",
};

const testEvents: Event[] = [
  {
    id: "lqjhl4j7ef",
    name: "CS9999 Introduction to Testing - Lecture (Sem 1)",
    description: "A test case for fetching an event with an exact name",
    ownerId: testEventsOwner.id,
  },
  {
    id: "a96f907elk",
    name: "CS9999 Introduction to Testing - Tutorial (Sem 1)",
    description: "A test case for fetching multiple events with a prefix",
    ownerId: testEventsOwner.id,
  },
  {
    id: "ldz47asavc",
    name: "CS9999 Introduction to Testing - Tutorial (Sem 2)",
    description: "A test case for fetching multiple events with a prefix",
    ownerId: testEventsOwner.id,
  },
];

// initialization and cleanup for this suite

beforeAll(() => {
  const jobs: Promise<any>[] = [];
  testUsers.forEach((user) =>
    jobs.push(
      db
        .insertUser(user.email, user.name, user.password)
        .then((returnedUser) => (user.id = returnedUser?.id ?? user.id)),
    ),
  );

  jobs.push(
    prisma.user
      .create({ data: testEventsOwner })
      .then(async () => prisma.event.createMany({ data: testEvents })),
  );

  return Promise.all(jobs);
});

afterAll(() => {
  const jobs: Promise<any>[] = [];
  testUsers.forEach((user) => jobs.push(db.removeUser(user.id)));

  jobs.push(
    prisma.event
      .deleteMany({
        where: { id: { in: testEvents.map((event) => event.id) } },
      })
      .then(() => prisma.user.delete({ where: testEventsOwner })),
  );
  return Promise.all(jobs);
});

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
  });

  it("fetches users based on exact name", async () => {
    const exactUsers = await db.getUsersFromNameOrEmail(
      testUsers[0].name,
      5,
      true,
    );
    expect(exactUsers[0].email).toBe(testUsers[0].email);
  });

  it("fetches users based on non-exact email", async () => {
    const nonExactUsers = await db.getUsersFromNameOrEmail(
      "@test.example.org",
      5,
      false,
    );
    expect(nonExactUsers.map((user) => user.name).sort()).toEqual(
      testUsers
        .slice(1)
        .map((user) => user.name)
        .sort(),
    );
  });
});

describe("Database events", () => {
  it("fetches an event with exact name", async () => {
    const eventName = testEvents[0].name;
    const res = await db.getEventsFromName(eventName, 1, true);
    expect(res.length).toBe(1);
    expect(res[0].name).toBe(eventName);
  });

  it("fetches multiple events with prefix", async () => {
    const eventName = "CS9999 Introduction to Testing - Tutorial";
    const res = await db.getEventsFromName(eventName, 5, false);
    expect(res).toMatchSnapshot();
  });

  it("fetches multiple events with case insensitive words", async () => {
    const eventName = "cs9999 sem 1";
    const res = await db.getEventsFromName(eventName, 5, false);
    expect(res).toMatchSnapshot();
  });
});

describe("Database attendances", () => {
  it("inserts, fetches and deletes an attendance", async () => {
    const eventName = "CS2100 Computer Organisation - Lecture (Sem 2)";
    const testUser = (await db.getUserFromEmail("person1@gmail.com")) as User;
    const event = (await db.getEventsFromName(eventName, 1, true))[0];
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
  });
});
