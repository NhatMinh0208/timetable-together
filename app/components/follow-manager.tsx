"use client";
import { User, UserWithStatus } from "@/app/lib/types";
import { AcceptFollow, RemoveFollow } from "./buttons";

export function FollowComponent({
  currentUser,
  otherUser,
  isFollower,
  isFollowing,
}: {
  currentUser: User;
  otherUser: UserWithStatus;
  isFollower: boolean;
  isFollowing: boolean;
}) {
  return (
    <div className="text-sm">
      <div>{otherUser.name}</div>
      <div>{otherUser.status}</div>
      <div className="flex flex-row w-4">
        {otherUser.status === "pending" && isFollower ? (
          <>
            <AcceptFollow
              labl="Accept"
              followerId={otherUser.id}
              followedId={currentUser.id}
            />
            <RemoveFollow
              labl="Decline"
              followerId={otherUser.id}
              followedId={currentUser.id}
            />
          </>
        ) : (
          <RemoveFollow
            labl="Remove"
            followerId={isFollower ? otherUser.id : currentUser.id}
            followedId={isFollowing ? otherUser.id : currentUser.id}
          />
        )}
      </div>
    </div>
  );
}

export function FollowManager({
  currentUser,
  userFollows,
  userFollowers,
}: {
  currentUser: User;
  userFollows: UserWithStatus[] | undefined;
  userFollowers: UserWithStatus[] | undefined;
}) {
  return (
    <div className={"overflow-auto space-y-2"}>
      <div className="text-2xl text-center">Follows</div>
      {userFollows?.map((user, i) => (
        <FollowComponent
          key={i}
          currentUser={currentUser}
          otherUser={user}
          isFollower={false}
          isFollowing={true}
        />
      ))}
      <div className="text-2xl text-center">Followers</div>

      {userFollowers?.map((user, i) => (
        <FollowComponent
          key={i}
          currentUser={currentUser}
          otherUser={user}
          isFollower={true}
          isFollowing={false}
        />
      ))}
    </div>
  );
}
