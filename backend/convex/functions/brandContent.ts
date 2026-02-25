import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Get brand story / About content
 */
export const getBrandStory = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db
      .query('brandContent')
      .withIndex('by_type', (q) => q.eq('type', 'about'))
      .collect();

    return results
      .filter((c) => c.isPublished)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },
});

/**
 * Get brand philosophy cards
 */
export const getPhilosophy = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db
      .query('brandContent')
      .withIndex('by_type', (q) => q.eq('type', 'philosophy'))
      .collect();

    return results
      .filter((c) => c.isPublished)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },
});

/**
 * Get timeline entries
 */
export const getTimeline = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db
      .query('brandContent')
      .withIndex('by_type', (q) => q.eq('type', 'timeline'))
      .collect();

    return results
      .filter((c) => c.isPublished)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },
});

/**
 * Get latest announcement
 */
export const getLatestAnnouncement = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db
      .query('brandContent')
      .withIndex('by_type', (q) => q.eq('type', 'announcement'))
      .order('desc')
      .collect();

    return results.find((c) => c.isPublished) ?? null;
  },
});

/**
 * Get content by slug
 */
export const getContentBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('brandContent')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();

    return results?.isPublished ? results : null;
  },
});

/**
 * Create brand content (admin)
 */
export const createContent = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    body: v.string(),
    type: v.union(
      v.literal('about'),
      v.literal('philosophy'),
      v.literal('timeline'),
      v.literal('announcement'),
      v.literal('blog')
    ),
    tags: v.array(v.string()),
    sortOrder: v.optional(v.number()),
    imageURL: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('brandContent', {
      ...args,
      isPublished: args.isPublished ?? false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Seed initial brand content
 */
export const seedBrandContent = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const items = [
      {
        title: 'Who is Biiggg X?',
        slug: 'who-is-biiggg-x',
        type: 'about' as const,
        body: 'Biiggg X wasn\'t born in a design studio or a marketing meeting. It was tagged on a wall, spoken on a corner, and worn by people who don\'t follow — they lead.',
        tags: ['about', 'origin'],
        sortOrder: 1,
        isPublished: true,
      },
      {
        title: 'The Meaning of X',
        slug: 'meaning-of-x',
        type: 'about' as const,
        body: 'X marks the unknown, the crossroads, the untraceable. In mathematics it\'s a variable. In art it\'s a mark. In Biiggg X, it\'s everything.',
        tags: ['about', 'x', 'symbolism'],
        sortOrder: 2,
        isPublished: true,
      },
      {
        title: 'Refuse the Ordinary',
        slug: 'refuse-the-ordinary',
        type: 'philosophy' as const,
        body: 'Generic is the enemy. Every Biiggg X piece starts with the question: what would make someone stop and look twice?',
        tags: ['philosophy'],
        sortOrder: 1,
        isPublished: true,
      },
      {
        title: 'The Street Is the Canvas',
        slug: 'street-is-canvas',
        type: 'philosophy' as const,
        body: 'We don\'t design in boardrooms. The city is our studio. Its walls, its energy, its people — all of it feeds the work.',
        tags: ['philosophy', 'street'],
        sortOrder: 2,
        isPublished: true,
      },
    ];

    const ids = [];
    for (const item of items) {
      const id = await ctx.db.insert('brandContent', {
        ...item,
        updatedAt: now,
        createdAt: now,
      });
      ids.push(id);
    }
    return ids;
  },
});
