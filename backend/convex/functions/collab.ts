import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Submit a collab/contact form request
 */
export const submitCollabForm = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    socialHandle: v.optional(v.string()),
    type: v.union(
      v.literal('collab'),
      v.literal('feature'),
      v.literal('media'),
      v.literal('stockist'),
      v.literal('other')
    ),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate inputs
    if (!args.name.trim()) throw new Error('Name is required');
    if (!args.email.trim() || !args.email.includes('@')) throw new Error('Valid email is required');
    if (!args.message.trim() || args.message.length < 10) throw new Error('Message too short');

    const id = await ctx.db.insert('collabRequests', {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      socialHandle: args.socialHandle?.trim(),
      type: args.type,
      message: args.message.trim(),
      status: 'new',
      createdAt: Date.now(),
    });

    return { success: true, id };
  },
});

/**
 * Get all collab requests (admin)
 */
export const getCollabRequests = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('new'),
        v.literal('reviewed'),
        v.literal('contacted'),
        v.literal('accepted'),
        v.literal('declined')
      )
    ),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('collabRequests')
      .withIndex('by_created')
      .order('desc')
      .collect();

    return args.status ? results.filter((r) => r.status === args.status) : results;
  },
});

/**
 * Update collab request status (admin)
 */
export const updateCollabStatus = mutation({
  args: {
    id: v.id('collabRequests'),
    status: v.union(
      v.literal('new'),
      v.literal('reviewed'),
      v.literal('contacted'),
      v.literal('accepted'),
      v.literal('declined')
    ),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      adminNotes: args.adminNotes,
    });
    return { success: true };
  },
});
