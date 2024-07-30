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
      <main className="flex h-full flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold">
          Error while trying to fetch event:
        </h1>
        <p className="text-2xl">{res.error}</p>
      </main>
    );
  }
}
// 1:40
