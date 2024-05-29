import { auth } from "@/auth";
import { redirect } from "next/dist/server/api-utils";

export default auth((req) => {
  if (!req.auth) {
    console.log(req.url);
    console.log(req.nextUrl.pathname);
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/(timetable.*)"],
};
