// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
"use client";
import React from "react";
import { Event } from "@/app/lib/types";
import { EventCard } from "@/app/components/event-card";
import { CreateEvent } from "@/app/components/buttons";
import LeftArrow from "@/app/static/left-arrow.svg";
import RightArrow from "@/app/static/right-arrow.svg";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function PageNavbar({
  page,
  handleLeftArrow,
  handleRightArrow,
}: {
  page: number;
  handleLeftArrow: () => void;
  handleRightArrow: () => void;
}) {
  return (
    <div className="flex flex-row flex-none justify-center h-[4%] w-full rounded-lg text-xl">
      <button
        className="h-full flex-row place-content-center"
        onClick={handleLeftArrow}
      >
        <Image src={LeftArrow} alt={"Left arrow"}></Image>
      </button>
      <p className="h-full flex-row place-content-center">Page {page}</p>
      <button
        className="h-full flex-row place-content-center"
        onClick={handleRightArrow}
      >
        <Image src={RightArrow} alt={"Right arrow"}></Image>
      </button>
    </div>
  );
}

export default function Render({ events }: { events: Event[] }) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const pathname = usePathname();
  const { replace } = useRouter();

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <main className="flex h-full w-dvw space-x-2 px-2 py-2">
      <div className="bg-slate-300 w-dvw rounded-md px-2 py-2 space-y-2 ">
        <div className="h-[4%] w-full text-2xl text-center font-semibold">
          Your events
        </div>
        <div className="h-[5%] w-full">
          <CreateEvent labl="Create event" />
        </div>
        <PageNavbar
          page={page}
          handleLeftArrow={() => {
            if (page !== 1) setPage(page - 1);
          }}
          handleRightArrow={() => {
            setPage(page + 1);
          }}
        />
        <div className=" w-full h-[86%] grid grid-cols-5 grid-rows-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </main>
  );
}
// 3:50
// 1:40
