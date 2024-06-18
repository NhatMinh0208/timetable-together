"use server";

import { passwordMatch, saltAndHashPassword } from "@/app/lib/password";
import {
  insertUser,
  getUserFromEmail,
  getEventFromName,
  getAttendance,
  insertAttendance,
  getAttendancesByUserId,
  updateAttedance,
  removeAttendance,
  getFollowsByFollowerId,
  getUserFromNameOrEmail,
  getFollow,
  insertFollow,
  getFollowsByFollowedId,
  removeFollow,
  updateFollowStatus,
} from "@/app/lib/db";
import { ExtendedAttendance, FollowStatus, User } from "@/app/lib/types";
import { auth, signOut } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { STATUS_ACTIVE, STATUS_PENDING } from "./constants";
export async function createUser(
  email: string,
  name: string,
  password: string,
) {
  const pwHash = await saltAndHashPassword(password);
  await insertUser(email, name, pwHash);
}

export async function authUser(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await getUserFromEmail(email);
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
  const user = await getUserFromEmail(email);
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
    const followTarget = await getUserFromNameOrEmail(fields.data.user);
    if (!followTarget)
      return {
        message: "Failed to make follow request: No such user exists",
      };

    const follow = await getFollow(userId, followTarget.id);
    if (follow)
      return {
        message:
          follow.status === STATUS_ACTIVE
            ? "Failed to make follow request: Already following user"
            : follow.status === STATUS_PENDING
              ? "Failed to make follow request: Already made follow request to user"
              : "Failed to make follow request: Follow in database (unknown status type)",
      };
    await insertFollow(userId, followTarget.id);

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
    if (!session?.user?.id) {
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
    if (!session?.user?.id) {
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

export async function getUserFollows() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not logged in");
    }
    const userId = session?.user?.id;
    return await getFollowsByFollowerId(userId);
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
    return await getFollowsByFollowedId(userId);
  } catch (error) {
    console.log(error);
    return;
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
      await removeFollow(followerId, followedId);
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
      await updateFollowStatus(followerId, followedId, status);
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
