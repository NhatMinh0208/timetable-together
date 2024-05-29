import { signOut } from "@/auth";

export function Logout() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Log out</button>
    </form>
  );
}
