import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

/** Throws if the caller is not authenticated as an admin. */
async function requireAdmin(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Unauthorized: must be signed in.');
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) throw new Error('ADMIN_EMAIL is not configured. Run: npx convex env set ADMIN_EMAIL you@domain.com');
  if (identity.email !== adminEmail) throw new Error('Unauthorized: admin access required.');
}

/**
 * Get all active merch items
 */
export const getMerch = query({
  args: {
    category: v.optional(
      v.union(
        v.literal('hoodie'),
        v.literal('cap'),
        v.literal('sticker'),
        v.literal('limited')
      )
    ),
    featuredOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query('merch').withIndex('by_active', (q) => q.eq('isActive', true));

    const results = await q.collect();

    return results
      .filter((item) => !args.category || item.category === args.category)
      .filter((item) => !args.featuredOnly || item.isFeatured === true)
      .sort((a, b) => {
        // Limited drops first
        if (a.category === 'limited' && b.category !== 'limited') return -1;
        if (b.category === 'limited' && a.category !== 'limited') return 1;
        // Featured items next
        if (a.isFeatured && !b.isFeatured) return -1;
        if (b.isFeatured && !a.isFeatured) return 1;
        // Then newest
        return b.createdAt - a.createdAt;
      });
  },
});

/**
 * Get a single merch item by ID
 */
export const getMerchById = query({
  args: { id: v.id('merch') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get featured merch for homepage
 */
export const getFeaturedMerch = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query('merch')
      .withIndex('by_featured', (q) => q.eq('isFeatured', true))
      .collect();

    return all.filter((item) => item.isActive).slice(0, 4);
  },
});

/**
 * Create a new merch item (admin only)
 */
export const createMerch = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal('hoodie'),
      v.literal('cap'),
      v.literal('sticker'),
      v.literal('limited')
    ),
    price: v.number(),
    inventory: v.number(),
    imageURL: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    sizes: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    isFeatured: v.optional(v.boolean()),
    isExclusive: v.optional(v.boolean()),
    stripePriceId: v.optional(v.string()),
    stripeProductId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert('merch', {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

/**
 * Update inventory after purchase
 */
export const decrementInventory = mutation({
  args: {
    merchId: v.id('merch'),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.merchId);
    if (!item) throw new Error('Merch item not found');
    if (item.inventory < args.quantity) throw new Error('Insufficient inventory');

    await ctx.db.patch(args.merchId, {
      inventory: item.inventory - args.quantity,
    });
  },
});

/**
 * Seed initial merch data
 */
export const seedMerch = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const items = [
      { name: 'X-Blaze Hoodie',         category: 'hoodie'  as const, price: 89,  inventory: 23, isFeatured: true,  isExclusive: false, tags: ['hoodie', 'crimson', 'signature'] },
      { name: 'Midnight Arch Hoodie',   category: 'hoodie'  as const, price: 95,  inventory: 14, isFeatured: false, isExclusive: false, tags: ['hoodie', 'dark'] },
      { name: 'Midnight Snap Cap',      category: 'cap'     as const, price: 42,  inventory: 7,  isFeatured: true,  isExclusive: false, tags: ['cap', 'snap'] },
      { name: 'Neon X Cap',             category: 'cap'     as const, price: 38,  inventory: 31, isFeatured: false, isExclusive: false, tags: ['cap', 'neon'] },
      { name: 'Graffiti Sticker Pack',  category: 'sticker' as const, price: 14,  inventory: 100,isFeatured: true,  isExclusive: false, tags: ['sticker', 'pack'] },
      { name: 'Neon Pulse Hoodie',      category: 'limited' as const, price: 120, inventory: 5,  isFeatured: true,  isExclusive: false, tags: ['limited', 'hoodie', 'neon'] },
      { name: 'Blood X Drop Tee',       category: 'limited' as const, price: 65,  inventory: 10, isFeatured: false, isExclusive: false, tags: ['limited', 'tee'] },
      { name: 'Chromatic X Jacket',     category: 'limited' as const, price: 180, inventory: 3,  isFeatured: true,  isExclusive: false, tags: ['limited', 'jacket'] },
      // Members-only exclusive drops
      { name: 'Pass Holder Shadow Tee', category: 'limited' as const, price: 75,  inventory: 20, isFeatured: true,  isExclusive: true,  tags: ['exclusive', 'members', 'tee'] },
      { name: 'X Members Cap',          category: 'cap'     as const, price: 55,  inventory: 15, isFeatured: false, isExclusive: true,  tags: ['exclusive', 'members', 'cap'] },
    ];

    const ids = [];
    for (const item of items) {
      const id = await ctx.db.insert('merch', {
        ...item,
        isActive: true,
        createdAt: now,
      });
      ids.push(id);
    }
    return ids;
  },
});

// ─── Admin functions ───────────────────────────────────────────────────────────

/**
 * Get all merch items including inactive (admin only)
 */
export const getAllMerch = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('merch').order('desc').collect();
  },
});

/**
 * Update a merch item (admin)
 */
export const updateMerch = mutation({
  args: {
    id: v.id('merch'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal('hoodie'),
        v.literal('cap'),
        v.literal('sticker'),
        v.literal('limited')
      )
    ),
    price: v.optional(v.number()),
    inventory: v.optional(v.number()),
    imageURL: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    isExclusive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(fields)) {
      if (val !== undefined) patch[k] = val;
    }
    await ctx.db.patch(id, patch);
    return id;
  },
});

/**
 * Delete a merch item (admin)
 */
export const deleteMerch = mutation({
  args: { id: v.id('merch') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/**
 * Generate a Convex Storage upload URL for merch images
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Resolve a storageId to a CDN URL and save it as the merch imageURL
 */
export const saveMerchImage = mutation({
  args: { id: v.id('merch'), storageId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const url = await ctx.storage.getUrl(args.storageId as Id<'_storage'>);
    if (!url) throw new Error('Could not resolve storage URL');
    await ctx.db.patch(args.id, { imageURL: url });
    return url;
  },
});
