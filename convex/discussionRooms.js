import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createNewRoom = mutation({
  args: {
    CoachingOption: v.string(),
    expert: v.string(),
    topic: v.string(),
    
  uid: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const coachingOption = args?.CoachingOption ?? args?.coachingOption ?? null;
    const expertName = args?.expert ?? args?.expertName ?? null;
    const topic = args?.topic ?? args?.Topic ?? null;

    if (!coachingOption || !expertName || !topic) {
      throw new Error("createNewRoom requires coachingOption, expertName and topic");
    }

    const roomId = await ctx.db.insert("DiscussionRoom", {
      coachingOption,
      expertName,
      topic,
      uid: args.uid ?? null,
    });

    return roomId;
  },
});


export const GetDiscussionRoom = query({
  args: { id: v.id("DiscussionRoom") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const UpdateConversation = mutation({
  args: {
    id: v.id("DiscussionRoom"),
    conversation: v.any()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      conversation: args.conversation
    });
  }
});


export const Updatesummary = mutation({
  args: {
    id: v.id("DiscussionRoom"),
    summary: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      summary: args.summary
    });
  }
});

export const GetAllDiscussionRooms= query({
  args:{
    uid: v.optional(v.id("users"))
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query("DiscussionRoom").filter(q=>q.eq(q.field("uid"),args.uid)).order('desc').collect();
    return result;
  }
});