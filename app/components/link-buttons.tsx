import { signOut } from "@/auth";
import Link from "next/link";

export function Login({ labl }: { labl: string }) {
  return (
    <Link
      href={"/login"}
      className="flex w-500 justify-center rounded-md bg-blue-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="submit"
    >
      {labl}
    </Link>
  );
}

export function Logout({ labl }: { labl: string }) {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button
        className="flex mx-auto w-500 justify-center rounded-md bg-red-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        type="submit"
      >
        {labl}
      </button>
    </form>
  );
}

export function Register({ labl }: { labl: string }) {
  return (
    <Link
      href={"/register"}
      className="flex w-500 justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="submit"
    >
      {labl}
    </Link>
  );
}

export function Timetable({ labl }: { labl: string }) {
  return (
    <Link
      href={"/timetable"}
      className="flex w-500 justify-center rounded-md bg-slate-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="submit"
    >
      {labl}
    </Link>
  );
}
