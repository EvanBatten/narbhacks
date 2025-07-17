"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function HomePage() {
  const challenges = useQuery(api.challenges.getChallenges, {});

  type Challenge = {
    _id: string;
    title: string;
    description: string;
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Social Accountability Tracker</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </header>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Challenges</h2>
        <Link href="/create-challenge" className="button px-4 py-2 text-white">
          Create Challenge
        </Link>
      </div>
      <ul className="space-y-4">
        {(challenges as Challenge[] | undefined)?.map((challenge) => (
          <li key={challenge._id} className="border p-4 rounded">
            <Link href={`/challenges/${challenge._id}`}>
              <span className="font-bold">{challenge.title}</span> <br />
              <span className="text-sm text-gray-600">
                {challenge.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
