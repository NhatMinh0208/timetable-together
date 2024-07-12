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
  Register,
  Timetable,
} from "@/app/components/link-buttons";
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
        <header className="mx-2 mt-2 flex items-center rounded-lg bg-slate-200 p-2">
          <Link
            href="/"
              className="h-full space-y-2 rounded-lg bg-slate-200 flex flex-row align-middle"
          >
            <Image src={Icon} alt="Logo" width={50} height={50}></Image>
            <span className="w-2"></span>
            <span className="text-2xl">Timetable Together</span>
          </Link>
          <span className="grow"></span>
          {session ? (
            <>
              <span className="text-2xl">{session?.user?.name}</span>
              <span className="w-2"></span>
              <Timetable labl="Timetable" />
              <span className="w-2"></span>
              <Logout labl="Sign out" />
            </>
          ) : (
            <>
              <Login labl={"Sign in"} />
              <span className="w-2"></span>
              <Register labl={"Register"} />
            </>
          )}
        </header>
        <div className="w-dvw min-h-0 grow">{children}</div>
      </body>
    </html>
  );
}
