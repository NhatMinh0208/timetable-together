"use client";
import { UserSearchBar } from "@/app/components/search-bar";
import { User, UserWithStatus } from "@/app/lib/types";
import { FollowManager } from "@/app/components/follow-manager";
export function FollowCard({
  currentUser,
  userFollows,
  userFollowers,
  userSearchResults,
}: {
  currentUser: User;
  userFollows: UserWithStatus[] | undefined;
  userFollowers: UserWithStatus[] | undefined;
  userSearchResults: {
    name: string;
  }[];
}) {
  return (
    <div
      className={
        "flex flex-col h-full w-1/6 grow-0 mx-auto px-2 py-2 space-y-2 rounded-lg bg-slate-200 text-xs"
      }
    >
      <UserSearchBar userSearchResults={userSearchResults} />
      <FollowManager
        currentUser={currentUser}
        userFollows={userFollows}
        userFollowers={userFollowers}
      />
    </div>
  );
}
