import { PrismaClient } from "@prisma/client";
// import { withPulse } from "@prisma/extension-pulse";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();
// .$extends(
//   withPulse({
//     apiKey: process.env["PULSE_API_KEY"] as string,
//   }),
// );

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
