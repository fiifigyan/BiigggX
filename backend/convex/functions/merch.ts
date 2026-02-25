import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';

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
    stripePriceId: v.optional(v.string()),
    stripeProductId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
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
      { name: 'X-Blaze Hoodie',       category: 'hoodie'  as const, price: 89,  inventory: 23, isFeatured: true,  tags: ['hoodie', 'crimson', 'signature'] },
      { name: 'Midnight Arch Hoodie', category: 'hoodie'  as const, price: 95,  inventory: 14, isFeatured: false, tags: ['hoodie', 'dark'] },
      { name: 'Midnight Snap Cap',    category: 'cap'     as const, price: 42,  inventory: 7,  isFeatured: true,  tags: ['cap', 'snap'] },
      { name: 'Neon X Cap',           category: 'cap'     as const, price: 38,  inventory: 31, isFeatured: false, tags: ['cap', 'neon'] },
      { name: 'Graffiti Sticker Pack',category: 'sticker' as const, price: 14,  inventory: 100,isFeatured: true,  tags: ['sticker', 'pack'] },
      { name: 'Neon Pulse Hoodie',    category: 'limited' as const, price: 120, inventory: 5,  isFeatured: true,  tags: ['limited', 'hoodie', 'neon'] },
      { name: 'Blood X Drop Tee',     category: 'limited' as const, price: 65,  inventory: 10, isFeatured: false, tags: ['limited', 'tee'] },
      { name: 'Chromatic X Jacket',   category: 'limited' as const, price: 180, inventory: 3,  isFeatured: true,  tags: ['limited', 'jacket'] },
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
