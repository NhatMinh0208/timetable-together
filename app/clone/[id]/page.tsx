// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
// It will pass fetched data to the render component, which does the actual rendering of things.
import Render from "./render";
import { getEventFullChecked } from "@/app/lib/actions";
export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const res = await getEventFullChecked(params.id);
  if (res.status === "success") {
    return <Render event={res.data} ownerName={res.data.owner.name} />;
  } else {
    return (
      <main className="flex flex-col place-content-center">
        <div className="font-semibold text-3xl text-center">
          Error while trying to fetch event:
        </div>
        <div className="text-2xl text-center">{res.error}</div>
      </main>
    );
  }
}
// 1:40
