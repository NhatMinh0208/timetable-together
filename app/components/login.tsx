import { signOut } from "@/auth";
import Link from "next/link";

export function Login() {
  return (
    <Link
      href={"/login"}
      className="flex w-500 justify-center rounded-md bg-blue-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="submit"
    >
      Sign in
    </Link>
  );
}
