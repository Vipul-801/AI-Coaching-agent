import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    name: v.string(),
    email: v.string(),
    credits: v.number(),
    SubscriptionId: v.optional(v.string()),
  }),

  discussionRoom: defineTable({
  CoachingOption: v.optional(v.string()),
  conversation: v.optional(v.any()),
  expertName: v.optional(v.string()),
  topic: v.optional(v.string()),
  summary: v.optional(v.string()),
  uid: v.optional(v.string(v.id("users"))),

}),
});
