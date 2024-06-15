import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import Image from "next/image";
import Icon from "@/app/icon.svg";
import { Logout } from "./components/logout";
import { auth } from "@/auth";
import { Login } from "@/app/components/login";
import { Register } from "@/app/components/register";

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
        <div className="w-dvw h-[8dvh] px-2 pt-2 pb-0 grow-0">
          <div
            className={
              "h-full px-2 py-2 space-y-2 rounded-lg bg-slate-200 flex flex-row align-middle"
            }
          >
            <Image src={Icon} alt="Logo" width={50} height={50}></Image>
            <span className="w-2"></span>
            <span className="text-2xl">Timetable Together</span>
            <span className="grow"></span>
            {session ? (
              <>
                <span className="text-2xl">{session?.user?.name}</span>
                <span className="w-2"></span>
                <Logout />
              </>
            ) : (
              <>
                <Login text={"Sign in"} />
                <span className="w-2"></span>
                <Register text={"Register"} />
              </>
            )}
          </div>
        </div>
        <div className="w-dvw h-[92dvh]  grow-0">{children}</div>
      </body>
    </html>
  );
}
