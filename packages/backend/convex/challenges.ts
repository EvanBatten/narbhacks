import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new challenge
export const createChallenge = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    creator: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const challengeId = await ctx.db.insert("challenges", {
      ...args,
      participants: [args.creator],
    });
    return challengeId;
  },
});

// Join a challenge
export const joinChallenge = mutation({
  args: { challengeId: v.id("challenges"), userId: v.string() },
  handler: async (ctx, { challengeId, userId }) => {
    const challenge = await ctx.db.get(challengeId);
    if (!challenge) throw new Error("Challenge not found");
    if (!challenge.participants.includes(userId)) {
      await ctx.db.patch(challengeId, {
        participants: [...challenge.participants, userId],
      });
    }
  },
});

// Log daily progress
export const logProgress = mutation({
  args: {
    challengeId: v.id("challenges"),
    userId: v.string(),
    date: v.string(),
    status: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("progressLogs", args);
  },
});

// Fetch all challenges
export const getChallenges = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("challenges").collect();
  },
});

// Fetch challenges for a user
export const getUserChallenges = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Get challenges where user is creator
    const created = await ctx.db
      .query("challenges")
      .filter((q) => q.eq(q.field("creator"), userId))
      .collect();
    // Get all challenges and filter for participant in JS
    const allChallenges = await ctx.db.query("challenges").collect();
    const joined = allChallenges.filter((c) => c.participants.includes(userId));
    // Merge and deduplicate by _id
    const all = [...created, ...joined].filter(
      (c, i, arr) => arr.findIndex((x) => x._id === c._id) === i,
    );
    return all;
  },
});

// Fetch progress logs for a challenge
export const getProgressLogs = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, { challengeId }) => {
    return await ctx.db
      .query("progressLogs")
      .filter((q) => q.eq(q.field("challengeId"), challengeId))
      .collect();
  },
});
