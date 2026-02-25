import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Create a user record on first sign-in, or update name if it changed.
 * Called from the frontend whenever a Clerk session is active.
 */
export const createOrUpdateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const email = identity.email ?? '';
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (existing) {
      const name = identity.name ?? existing.name;
      if (existing.name !== name) {
        await ctx.db.patch(existing._id, { name });
      }
      return existing._id;
    }

    return await ctx.db.insert('users', {
      name: identity.name ?? 'Unknown',
      email,
      role: 'customer',
      createdAt: Date.now(),
    });
  },
});

/**
 * Get the current user's Convex record.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email ?? ''))
      .first();
  },
});
