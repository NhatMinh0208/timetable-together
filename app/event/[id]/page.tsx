// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
// It will pass fetched data to the render component, which does the actual rendering of things.
import { getEvent, getEventFull } from "@/app/lib/db";
import Render from "./render";
export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const event = await getEventFull(params.id);
  if (!event) {
    return <main>Error: Event not found.</main>;
  }
  return <Render event={event} ownerName={event.owner.name} />;
}
// 1:40
