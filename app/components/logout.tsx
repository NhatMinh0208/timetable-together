import { signOut } from "@/auth";

export function Logout() {
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
        Log out
      </button>
    </form>
  );
}
