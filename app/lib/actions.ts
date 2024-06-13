"use server";

import { passwordMatch, saltAndHashPassword } from "@/app/lib/password";
import {
  insertUserToDb,
  getUserFromDb,
  getEventFromName,
  getAttendance,
  insertAttendance,
  getAttendancesByUserId,
  updateAttedance,
  removeAttendance,
} from "@/app/lib/db";
import { ExtendedAttendance, User } from "@/app/lib/types";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
export async function createUser(
  email: string,
  name: string,
  password: string,
) {
  const pwHash = await saltAndHashPassword(password);
  await insertUserToDb(email, name, pwHash);
}

export async function authUser(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await getUserFromDb(email);
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
  const user = await getUserFromDb(email);
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

export type AddAttendanceState =
  | {
      errors?: {
        eventName?: string[];
      };
      message?: string;
    }
  | undefined;

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
    const eventName = formData.get("eventName");
    const fields = AddAttendanceSchema.safeParse({
      eventName: formData.get("eventName"),
    });
    if (!fields.success) {
      return {
        errors: fields.error.flatten().fieldErrors,
        message: "Failed to add event to timetable: Form Error",
      };
    }
    const event = await getEventFromName(fields.data.eventName);
    if (!event)
      return {
        message: "Failed to add event to timetable: No such event exists",
      };
    if (event.schedules.length === 0)
      return {
        message: "Failed to add event to timetable: Event has no schedules",
      };
    const attendance = await getAttendance(userId, event.id);
    if (attendance)
      return {
        message:
          "Failed to add event to timetable: Event is already in timetable",
      };
    await insertAttendance(userId, event.id, event.schedules[0].id);
    revalidatePath("/timetable");
  } catch (error) {
    console.log(error);
    return {
      message: "Failed to add event to timetable: Database Error",
    };
  }
}

export async function getUserAttendances(): Promise<ExtendedAttendance[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    return await getAttendancesByUserId(userId);
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
    if (!session) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    await updateAttedance(userId, eventId, scheduleId);
    console.log("done");
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function removeUserAttendance(eventId: string): Promise<void> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id ? session.user.id : "";
    await removeAttendance(userId, eventId);
    console.log("done");
    revalidatePath("/timetable");
  } catch (error) {
    console.log(error);
    return;
  }
}
