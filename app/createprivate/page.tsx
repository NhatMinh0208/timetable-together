"use client";
// For some reason we cannot use Server Actions to fetch data from Client Components.
// This is pretty stupid, but I guess we have to make-do with it.
// The page component will be for fetching data only.
// It will pass fetched data to the render component, which does the actual rendering of things.
import Render from "./render";
export default function Page() {
  return <Render />;
}
// 1:40
