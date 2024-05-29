import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth) {
    console.log(req.url);
    console.log(req.nextUrl.pathname);
    const url = req.url.replace(req.nextUrl.pathname, "/login");
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/(timetable.*)"],
};
