import "@testing-library/jest-dom";
import * as db from "@/app/lib/db";
import { User } from "@prisma/client";

describe("Database", () => {
  it("fetches an event with exact name", async () => {
    const eventName = "CS2100 Computer Organisation - Lecture (Sem 2)";
    const res = await db.getEventsFromName(eventName, 1, true);
    expect(res.length).toBe(1);
    expect(res[0].name).toBe(eventName);
  });
  it("fetches multiple events with prefix", async () => {
    const eventName = "CS2100 Computer Organisation - Lecture";
    const res = await db.getEventsFromName(eventName, 5, false);
    expect(res).toMatchSnapshot();
  });

  it("inserts, fetches and deletes an user", async () => {
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
});

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
