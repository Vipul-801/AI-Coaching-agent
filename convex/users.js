import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.optional(v.string()), // Make name optional
    email: v.string()
  },
  handler: async (ctx, args) => {
    
     const userData = await ctx.db.query("users")
       .filter(q => q.eq(q.field("email"), args.email))
       .collect();
     if (userData?.length === 0) {
       const data = {
         name: args.name,
         email: args.email,
         credits: 50000
       };
       const result = await ctx.db.insert("users", data);
       console.log(result);
       return data;
     } else {
       // User already exists, return existing user
       return userData[0];
     }
  }
});

