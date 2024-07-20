import { auth } from "@/auth";
import { redirect } from "next/dist/server/api-utils";

export default auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/(timetable.*)", "/(myevents.*)", "/(create.*)", "/(export.*)"],
};
