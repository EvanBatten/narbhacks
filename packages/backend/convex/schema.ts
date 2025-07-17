import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  challenges: defineTable({
    title: v.string(),
    description: v.string(),
    creator: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    participants: v.array(v.string()),
  }),
  progressLogs: defineTable({
    challengeId: v.id("challenges"),
    userId: v.string(),
    date: v.string(),
    status: v.string(),
    note: v.optional(v.string()),
  }),
});
