"use server";

import { passwordMatch, saltAndHashPassword } from "@/app/lib/password";
import { insertUserToDb, getUserFromDb } from "@/app/lib/db";
import { User } from "./types";

export async function createUser(
  email: string,
  name: string,
  password: string,
) {
  const pwHash = await saltAndHashPassword(password);
  await insertUserToDb(email, name, pwHash);
}

export async function getUser(
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
