import { signOut } from "@/auth";
import Link from "next/link";
import {
  removeUserAttendance,
  removeUserEvent,
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
    <form>
      <button
        formAction={signOutProper}
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
      className="flex justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {labl}
    </Link>
  );
}

export function MyEvents({ labl }: { labl: string }) {
  return (
    <Link
      href={"/myevents"}
      className="flex justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {labl}
    </Link>
  );
}

export function CreateEvent({ labl }: { labl: string }) {
  return (
    <Link
      href={"/create"}
      className="flex mx-auto justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {labl}
    </Link>
  );
}

export function DeleteEvent({ labl, id }: { labl: string; id: string }) {
  return (
    <button
      className="flex mx-auto justify-center rounded-md bg-red-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={() => removeUserEvent(id)}
    >
      {labl}
    </button>
  );
}

export function ViewEvent({ labl, id }: { labl: string; id: string }) {
  return (
    <Link
      href={"/event/" + id}
      className="flex mx-auto justify-center rounded-md bg-blue-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

export function RemoveAttendance({
  labl,
  eventId,
}: {
  labl: string;
  eventId: string;
}) {
  return (
    <button
      className="flex mx-auto justify-center rounded-md bg-red-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={() => removeUserAttendance(eventId)}
    >
      {labl}
    </button>
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
