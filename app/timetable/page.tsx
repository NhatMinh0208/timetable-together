// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
// It will pass fetched data to the render component, which does the actual rendering of things.
import { getUserAttendances } from "@/app/lib/actions";
import Render from "./render";
export default async function Page() {
  const attendances = await getUserAttendances();
  return <Render attendances={attendances} />;
}
// 3:50
// 2:00
// 2:50
// 3:00
