import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import Image from "next/image";
import Icon from "@/app/icon.svg";
import {
  Export,
  Login,
  Logout,
  MyEvents,
  Register,
  Timetable,
} from "@/app/components/buttons";
import { auth } from "@/auth";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timetable Together",
  description: "A platform for collaborative timetabling",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={clsx(inter.className, "flex h-dvh flex-col")}>
        <header className="mx-2 mt-2 flex items-center gap-2 rounded-lg bg-slate-200 p-2">
          <Link href="/" className="mr-auto flex items-center gap-2">
            <Image src={Icon} alt="Logo" width={50} height={50}></Image>
            <h1 className="text-2xl">Timetable Together</h1>
          </Link>
          {session ? (
            <>
              <h2 className="text-2xl">{session?.user?.name}</h2>
              <Timetable labl="Timetable" />
              <MyEvents labl="Manage events" />
              <Logout labl="Sign out" />
            </>
          ) : (
            <>
              <Login labl={"Sign in"} />
              <Register labl={"Register"} />
            </>
          )}
        </header>
        <main className="min-h-0 grow">{children}</main>
      </body>
    </html>
  );
}
