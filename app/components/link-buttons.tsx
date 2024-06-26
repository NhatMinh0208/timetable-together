import { signOut } from "@/auth";
import Link from "next/link";
import {
  removeUserFollow,
  signOutProper,
  updateUserFollowStatus,
} from "@/app/lib/actions";

export function Login({ labl }: { labl: string }) {
  return (
    <Link
      href={"/login"}
      className="flex justify-center rounded-md bg-blue-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="submit"
    >
      {labl}
    </Link>
  );
}

export function Logout({ labl }: { labl: string }) {
  return (
    <form action={signOutProper}>
      <button
        className="flex mx-auto justify-center rounded-md bg-red-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
      className="flex justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {labl}
    </Link>
  );
}

export function Timetable({ labl }: { labl: string }) {
  return (
    <Link
      href={"/timetable"}
      className="flex mx-auto justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {labl}
    </Link>
  );
}

export function Export({ labl }: { labl: string }) {
  return (
    <Link
      href={"/export"}
      download={"timetable.ics"}
      className="flex justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {labl}
    </Link>
  );
}

export function RemoveFollow({
  labl,
  followerId,
  followedId,
}: {
  labl: string;
  followerId: string;
  followedId: string;
}) {
  return (
    <button
      className="flex mx-auto justify-center rounded-md bg-red-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={() => removeUserFollow(followerId, followedId)}
    >
      {labl}
    </button>
  );
}

export function AcceptFollow({
  labl,
  followerId,
  followedId,
}: {
  labl: string;
  followerId: string;
  followedId: string;
}) {
  return (
    <button
      className="flex mx-auto justify-center rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={() => updateUserFollowStatus(followerId, followedId, "active")}
    >
      {labl}
    </button>
  );
}
