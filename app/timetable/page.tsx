import { auth } from "@/auth";
import { Logout } from "@/app/components/logout";
import { Timetable } from "@/app/components/timetable";
export default async function Page() {
  const session = await auth();
  return (
    <main>
      <p className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Welcome, {session?.user.name}
      </p>
      <Timetable />
      <Logout />
    </main>
  );
}
