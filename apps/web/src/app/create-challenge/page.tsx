"use client";
import { useUser } from "@clerk/nextjs";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateChallengePage() {
  const { user } = useUser();
  const createChallenge = useMutation(api.challenges.createChallenge);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    await createChallenge({
      title,
      description,
      creator: user.id,
      startDate,
      endDate,
    });
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Create a Challenge</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="flex gap-2">
          <input
            className="flex-1 border p-2 rounded"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            className="flex-1 border p-2 rounded"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="button px-4 py-2 text-white w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Challenge"}
        </button>
      </form>
    </div>
  );
}
