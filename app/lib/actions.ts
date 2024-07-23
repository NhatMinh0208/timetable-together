"use server";

import { passwordMatch, saltAndHashPassword } from "@/app/lib/password";
import * as db from "@/app/lib/db";
import {
  EventInput,
  ExtendedAttendance,
  ExtendedEvent,
  FollowStatus,
  Note,
  SessionInput,
  User,
} from "@/app/lib/types";
import { auth, signIn, signOut } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { STATUS_ACTIVE, STATUS_PENDING } from "./constants";
import { convertEventInput, convertSessionInput } from "@/app/lib/input";
import { AuthError } from "next-auth";
export async function createUser(
  email: string,
  name: string,
  password: string,
) {
  const pwHash = await saltAndHashPassword(password);
  await db.insertUser(email, name, pwHash);
}

export async function authUser(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await db.getUserFromEmail(email);
  if (user == null) throw new Error("User not found");
  if (await passwordMatch(password, user.password)) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } else {
    throw new Error("Password mismatch");
  }
}

export async function getUser(email: string): Promise<User | null> {
  const user = await db.getUserFromEmail(email);
  if (user == null) throw new Error("User not found");
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

const AddAttendanceSchema = z.object({
  eventName: z.string(),
});

const AddFollowSchema = z.object({
  user: z.string(),
});

export type AddFollowState =
  | {
      errors?: {
        user?: string[];
      };
      message?: string;
    }
  | undefined;

export type AddAttendanceState =
  | {
      errors?: {
        eventName?: string[];
      };
      message?: string;
    }
  | undefined;

export type CreateEventState = {
  status: string;
  errors: string[];
};

export async function addAttendance(
  prevState: AddAttendanceState,
  formData: FormData,
) {
  try {
    const session = await auth();
    if (!session)
      return {
        message: "Failed to add event to timetable: User is not logged in",
      };
    const userId = session?.user?.id ? session.user.id : "";
    const fields = AddAttendanceSchema.safeParse({
      eventName: formData.get("eventName"),
    });
    if (!fields.success) {
      return {
        errors: fields.error.flatten().fieldErrors,
        message: "Failed to add event to timetable: Form Error",
      };
    }
    const result = await db.getEventsFromName(
      fields.data.eventName,
      1,
      true,
      userId,
    );
    const event = result[0];
    if (!event)
      return {
        message: "Failed to add event to timetable: No such event exists",
      };
    const eventFull = await db.getEventFull(event.id);
    if (eventFull.schedules.length === 0)
      return {
        message: "Failed to add event to timetable: Event has no schedules",
      };
    const attendance = await db.getAttendance(userId, event.id);
    if (attendance)
      return {
        message:
          "Failed to add event to timetable: Event is already in timetable",
      };
    await db.insertAttendance(userId, event.id, eventFull.schedules[0].id);

    revalidatePath("/timetable");
  } catch (error) {
    console.log(error);
    return {
      message: "Failed to add event to timetable: Database Error",
    };
  }
}

export async function addFollowRequest(
  prevState: AddFollowState,
  formData: FormData,
) {
  try {
    const session = await auth();
    if (!session)
      return {
        message: "Failed to make follow request: User is not logged in",
      };
    const userId = session?.user?.id ? session.user.id : "";
    const fields = AddFollowSchema.safeParse({
      user: formData.get("user"),
    });
    if (!fields.success) {
      return {
        errors: fields.error.flatten().fieldErrors,
        message: "Failed to make follow request: Form Error",
      };
    }

    const result = await db.getUsersFromNameOrEmail(fields.data.user, 1, true);
    const followTarget = result[0];
    if (!followTarget)
      return {
        message: "Failed to make follow request: No such user exists",
      };
    if (userId == followTarget.id) {
      return {
        message: "Failed to make follow request: Cannot follow self",
      };
    }
    const follow = await db.getFollow(userId, followTarget.id);
    if (follow)
      return {
        message:
          follow.status === STATUS_ACTIVE
            ? "Failed to make follow request: Already following user"
            : follow.status === STATUS_PENDING
              ? "Failed to make follow request: Already made follow request to user"
              : "Failed to make follow request: Follow in database (unknown status type)",
      };
    await db.insertFollow(userId, followTarget.id);

    revalidatePath("/timetable");
  } catch (error) {
    console.log(error);
    return {
      message: "Failed to make follow request: Database Error",
    };
  }
}

export async function getUserAttendances(): Promise<ExtendedAttendance[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    return await db.getAttendancesByUserId(userId);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateUserAttendance(
  eventId: string,
  scheduleId: string,
): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    await db.updateAttedance(userId, eventId, scheduleId);
    console.log("done");
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function removeUserAttendance(eventId: string): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    await db.removeAttendance(userId, eventId);
    console.log("done");
    revalidatePath("/timetable");
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function getUserFollows() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id;
    return await db.getFollowsByFollowerId(userId);
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function getUserFollowers() {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    return await db.getFollowsByFollowedId(userId);
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function getUserOwnedEvents(count: number, page: number) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    return await db.getOwnedEvents(userId, count, page);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function removeUserFollow(followerId: string, followedId: string) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    if (followerId === userId || followedId === userId) {
      await db.removeFollow(followerId, followedId);
      revalidatePath("/timetable");
      return;
    } else {
      throw new Error("User not authorized to remove follow");
    }
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function updateUserFollowStatus(
  followerId: string,
  followedId: string,
  status: FollowStatus,
) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    if (followerId === userId || followedId === userId) {
      await db.updateFollowStatus(followerId, followedId, status);
      revalidatePath("/timetable");
      return;
    } else {
      throw new Error("User not authorized to update follow status");
    }
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function signOutProper(formData: FormData) {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export async function validateEvent(
  state: CreateEventState,
  event: ExtendedEvent,
) {
  if (event.name === "") {
    state.errors.push(
      "Event has empty name. Please make sure the event has a non-empty name.",
    );
  }
  if (event.schedules.length === 0) {
    state.errors.push(
      "There are no schedules in the event. Please make sure the event has at least one schedule.",
    );
  }
  event.schedules.forEach((schedule, i) => {
    if (schedule.name === "") {
      state.errors.push(
        "Schedule " +
          (i + 1).toString() +
          " has empty name. Please make sure each schedule has a name.",
      );
    }
  });
}

export async function createEvent(
  state: CreateEventState,
  event: ExtendedEvent,
) {
  const newState: CreateEventState = {
    status: "",
    errors: [],
  };
  try {
    const session = await auth();
    if (!session) {
      newState.status =
        "An error has occured while trying to create the event:";
      newState.errors.push("User is not logged in");
      return newState;
    }
    const userId = session?.user?.id ? session.user.id : "";
    validateEvent(newState, event);

    if (newState.errors.length > 0) {
      newState.status =
        "An error(s) has occured while trying to create the event:";
      return newState;
    }

    const insertedEvent = await db.insertEvent(
      userId,
      event.name,
      event.description,
      false,
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
    revalidatePath("/myevents");
    newState.status =
      'Success! Your new event can be found in "Manage Events".';
    return newState;
  } catch (error) {
    console.log(error);
    newState.status = "An error has occured while trying to create the event:";
    newState.errors.push(
      "Database error! Please submit an issue on our GitHub page at: github.com/NhatMinh0208/timetable-together",
    );
    return newState;
  }
}

export async function createPrivateSession(
  state: CreateEventState,
  input: SessionInput,
  name: string,
  description: string,
) {
  const newState: CreateEventState = {
    status: "",
    errors: [],
  };
  try {
    const authSession = await auth();
    if (!authSession) {
      newState.status =
        "An error has occured while trying to create the session:";
      newState.errors.push("User is not logged in");
      return newState;
    }
    const userId = authSession?.user?.id ? authSession.user.id : "";
    console.log(input);
    const session = convertSessionInput(state, input, "[none]", 1);

    if (newState.errors.length > 0) {
      newState.status =
        "An error(s) has occured while trying to create the session:";
      return newState;
    }

    const insertedEvent = await db.insertEvent(userId, name, description, true);
    const insertedSchedule = await db.insertSchedule(insertedEvent.id, "1");
    const insertedSession = await db.insertSession(
      insertedSchedule.id,
      session.place,
      session.timeZone,
      session.startTime,
      session.endTime,
      session.startDate,
      session.endDate,
      session.interval,
    );

    await db.insertAttendance(userId, insertedEvent.id, insertedSchedule.id);

    revalidatePath("/myevents");
    newState.status =
      'Success! Your private session can also be found in "Manage Events".';
    return newState;
  } catch (error) {
    console.log(error);
    newState.status =
      "An error has occured while trying to create the session:";
    newState.errors.push(
      "Database error! Please submit an issue on our GitHub page at: github.com/NhatMinh0208/timetable-together",
    );
    return newState;
  }
}

export async function removeUserEvent(eventId: string): Promise<void> {
  console.log("remove");
  console.log(eventId);
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    const event = await db.getEvent(eventId);
    if (!event?.ownerId) {
      throw new Error("No event with matching ID");
    }
    if (event?.ownerId !== userId) {
      throw new Error("User does not own event");
    }

    await db.removeEvent(eventId);
    console.log("done");
    revalidatePath("/myevents");
    revalidatePath("/timetable");
    return;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function getUserRecvNotes(): Promise<Note[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    const res = await db.getRecvNotes(userId);
    if (res) {
      return res.map((data) => ({
        id: data.note.id,
        sender: data.note.sender,
        content: data.note.content,
        position: data.note.position,
        timeSent: data.note.timeSent,
        read: data.read,
      }));
    } else return [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createNote(
  content: string,
  position: Date,
  recipientList: string[],
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    const note = await db.insertNote(userId, content, position, new Date());
    const recipients = await db.getUsersFromNameOrEmail(
      recipientList,
      1000,
      true,
    );
    const recipientIds: string[] = [];
    for (const recp of recipients) {
      if (await db.hasRelationship(userId, recp.id)) recipientIds.push(recp.id);
    }
    recipientIds.push(userId);
    const res = await db.insertRecipients(note.id, recipientIds);
    revalidatePath("timetable");
    return note;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function removeUserNote(noteId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    const res = await db.removeNote(userId, noteId);
    revalidatePath("timetable");
    return res;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function updateUserNoteRead(noteId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    const res = await db.updateNoteRead(userId, noteId);
    return;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function signInFromForm(state: CreateEventState, input: FormData) {
  const res: CreateEventState = {
    status: "",
    errors: [],
  };
  try {
    input.append("redirectTo", "/timetable");
    await signIn("credentials", input);
    if (res.errors.length !== 0) {
    } else {
      res.status = "Success!";
    }
  } catch (e) {
    console.log(e);
    // console.log("SADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
    // console.log(e instanceof AuthError)
    if (e instanceof AuthError) {
      // console.log(e.cause?.err)
      res.status = "Login was unsuccessful. Check your email and/or password.";
      if (e.cause?.err) {
        // console.log(e.cause?.err.message)
        res.errors.push(e.cause?.err.message);
      }
    } else {
      throw e;
    }
  }

  return res;
}

export async function getEventFullChecked(id: string) {
  try {
    const res = await db.getEventFull(id);
    if (res.private) {
      const session = await auth();
      if (!session?.user?.id || session?.user?.id !== res.owner.id) {
        return {
          status: "error" as "error",
          error: "User not authorized to view event",
        };
      }
    }
    return {
      status: "success" as "success",
      data: res,
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        status: "error" as "error",
        error: e.message,
      };
    } else
      return {
        status: "error" as "error",
        error: "Unknown error",
      };
  }
}

export async function getEventManyChecked(ids: string[]) {
  try {
    const authSession = await auth();
    const res = await db.getEventMany(ids);
    for (const event of res) {
      if (event.owner.id !== authSession?.user?.id && event.private) {
        event.name = "[Private session]";
        event.description = "";
        for (const sch of event.schedules) {
          sch.name = "";
          for (const session of sch.sessions) {
            session.place = "";
          }
        }
      }
    }
    return res;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function getEventsFromNameChecked(
  name: string,
  limit: number,
  exact: boolean,
) {
  try {
    const authSession = await auth();
    return await db.getEventsFromName(
      name,
      limit,
      exact,
      authSession?.user?.id ? authSession.user.id : "",
    );
  } catch (e) {
    console.log(e);
    return [];
  }
}
