import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Welcome, {session?.user.name}</p>
    </main>
  );
}
