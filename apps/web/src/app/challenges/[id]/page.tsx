"use client";
import { useUser } from "@clerk/nextjs";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ChallengeDetailPage() {
  const { user } = useUser();
  const params = useParams();
  const challengeId = params?.id as string;
  type Challenge = {
    _id: string;
    title: string;
    description: string;
    creator: string;
    startDate: string;
    endDate: string;
    participants: string[];
  };
  type ProgressLog = {
    _id: string;
    challengeId: string;
    userId: string;
    date: string;
    status: string;
    note?: string;
  };
  const challenge = (
    useQuery(api.challenges.getChallenges, {}) as Challenge[] | undefined
  )?.find((c: Challenge) => c._id === challengeId);
  const progressLogs = useQuery(
    api.challenges.getProgressLogs,
    challengeId ? { challengeId } : "skip",
  ) as ProgressLog[] | undefined;
  const logProgress = useMutation(api.challenges.logProgress);
  const joinChallenge = useMutation(api.challenges.joinChallenge);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("complete");
  const [loading, setLoading] = useState(false);

  if (!challenge) return <div className="p-6">Loading...</div>;

  const isParticipant = user && challenge.participants.includes(user.id);

  const today = new Date().toISOString().slice(0, 10);
  const hasLoggedToday = progressLogs?.some(
    (log) => log.userId === user?.id && log.date === today,
  );

  const handleJoin = async () => {
    if (!user) return;
    setLoading(true);
    await joinChallenge({ challengeId, userId: user.id });
    setLoading(false);
  };

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    await logProgress({
      challengeId,
      userId: user.id,
      date: today,
      status,
      note,
    });
    setLoading(false);
    setNote("");
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
      <p className="mb-2">{challenge.description}</p>
      <div className="mb-2 text-sm text-gray-600">
        {challenge.startDate} to {challenge.endDate}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Participants:</span>
        <ul className="list-disc ml-6">
          {challenge.participants.map((p: string) => (
            <li key={p}>{p === user?.id ? "You" : p}</li>
          ))}
        </ul>
      </div>
      {!isParticipant && user && (
        <button
          type="button"
          className="button px-4 py-2 text-white mb-4"
          onClick={handleJoin}
          disabled={loading}
        >
          {loading ? "Joining..." : "Join Challenge"}
        </button>
      )}
      {isParticipant && (
        <form onSubmit={handleLog} className="mb-6 space-y-2">
          <div className="font-semibold">Log Today’s Progress ({today}):</div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            type="submit"
            className="button px-4 py-2 text-white"
            disabled={loading || hasLoggedToday}
          >
            {hasLoggedToday
              ? "Already Logged Today"
              : loading
                ? "Logging..."
                : "Log Progress"}
          </button>
        </form>
      )}
      <div>
        <h2 className="text-lg font-semibold mb-2">Progress Logs</h2>
        <ul className="space-y-2">
          {progressLogs?.map((log: ProgressLog) => (
            <li key={log._id} className="border p-2 rounded">
              <span className="font-bold">
                {log.userId === user?.id ? "You" : log.userId}
              </span>
              : {log.status}
              {log.note && <span> — {log.note}</span>}
              <span className="text-xs text-gray-500 float-right">
                {log.date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
