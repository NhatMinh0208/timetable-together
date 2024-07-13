// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
// It will pass fetched data to the render component, which does the actual rendering of things.
import { getUserOwnedEvents } from "@/app/lib/actions";
import Render from "./render";
import { EVENT_PAGE_SIZE } from "../lib/constants";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const events = await getUserOwnedEvents(
    EVENT_PAGE_SIZE,
    parseInt(searchParams?.page ? searchParams.page : "1"),
  );
  return <Render events={events} />;
}
// 1:40
