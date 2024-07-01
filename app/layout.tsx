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
      <body className={clsx(inter.className, "h-dvh w-dvw")}>
        <div className="w-dvw px-2 pt-2 pb-0 grow-0">
          <div
            className={
              "h-full px-2 py-2 space-y-2 rounded-lg bg-slate-200 flex flex-row align-middle"
            }
          >
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
          </div>
        </div>
        <div className="w-dvw h-[92dvh]  grow-0">{children}</div>
      </body>
    </html>
  );
}
