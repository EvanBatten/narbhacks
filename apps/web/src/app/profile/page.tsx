"use client";
import { useUser } from "@clerk/nextjs";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";

type Challenge = {
  _id: string;
  title: string;
  description: string;
  creator: string;
  startDate: string;
  endDate: string;
  participants: string[];
};

export default function ProfilePage() {
  const { user } = useUser();
  const userChallenges = useQuery(
    api.challenges.getUserChallenges,
    user ? { userId: user.id } : "skip",
  );

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">My Challenges</h1>
      {!user && <div>Please sign in to view your challenges.</div>}
      {user && (
        <ul className="space-y-4">
          {(userChallenges as Challenge[] | undefined)?.map(
            (challenge: Challenge) => (
              <li key={challenge._id} className="border p-4 rounded">
                <div className="font-bold">{challenge.title}</div>
                <div className="text-sm text-gray-600">
                  {challenge.description}
                </div>
                <div className="text-xs text-gray-500">
                  {challenge.startDate} to {challenge.endDate}
                </div>
                <div className="text-xs mt-1">
                  Role:{" "}
                  {challenge.creator === user.id ? "Creator" : "Participant"}
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
