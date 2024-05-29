"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { saltAndHashPassword } from "@/app/lib/password";
import { createId10 } from "@/app/lib/cuid2";
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
