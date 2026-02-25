import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Get all published media
 */
export const getMedia = query({
  args: {
    type: v.optional(
      v.union(
        v.literal('reel'),
        v.literal('showcase'),
        v.literal('merch'),
        v.literal('campaign'),
        v.literal('reveal'),
        v.literal('behind-the-scenes')
      )
    ),
    platform: v.optional(
      v.union(
        v.literal('tiktok'),
        v.literal('instagram'),
        v.literal('youtube'),
        v.literal('twitter'),
        v.literal('internal')
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query('media')
      .withIndex('by_published', (q) => q.eq('isPublished', true))
      .order('desc')
      .collect();

    if (args.type) results = results.filter((m) => m.type === args.type);
    if (args.platform) results = results.filter((m) => m.platform === args.platform);
    if (args.limit) results = results.slice(0, args.limit);

    return results;
  },
});

/**
 * Get a single media item
 */
export const getMediaById = query({
  args: { id: v.id('media') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Add a media item (admin)
 */
export const addMedia = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal('reel'),
      v.literal('showcase'),
      v.literal('merch'),
      v.literal('campaign'),
      v.literal('reveal'),
      v.literal('behind-the-scenes')
    ),
    platform: v.union(
      v.literal('tiktok'),
      v.literal('instagram'),
      v.literal('youtube'),
      v.literal('twitter'),
      v.literal('internal')
    ),
    url: v.optional(v.string()),
    thumbnailURL: v.optional(v.string()),
    embedId: v.optional(v.string()),
    duration: v.optional(v.string()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('media', {
      ...args,
      isPublished: true,
      viewCount: 0,
      createdAt: Date.now(),
    });
  },
});

/**
 * Increment view count
 */
export const incrementViews = mutation({
  args: { id: v.id('media') },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) return;
    await ctx.db.patch(args.id, { viewCount: (item.viewCount ?? 0) + 1 });
  },
});

/**
 * Seed media data
 */
export const seedMedia = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const items = [
      {
        title: 'Graffiti Spray Intro',
        type: 'reel' as const,
        platform: 'tiktok' as const,
        duration: '0:32',
        tags: ['#BiigggX', '#SprayArt'],
      },
      {
        title: 'Electric Pulse Drop',
        type: 'showcase' as const,
        platform: 'instagram' as const,
        duration: '1:05',
        tags: ['#XMarksTheMoment', '#NewDrop'],
      },
      {
        title: 'Merch Showcase Reel',
        type: 'merch' as const,
        platform: 'instagram' as const,
        duration: '0:58',
        tags: ['#BiigggX', '#Streetwear'],
      },
      {
        title: 'Urban Streets Campaign',
        type: 'campaign' as const,
        platform: 'youtube' as const,
        duration: '2:14',
        tags: ['#BiigggX', '#UrbanCulture'],
      },
      {
        title: 'Hoodie Drop Reveal',
        type: 'reveal' as const,
        platform: 'tiktok' as const,
        duration: '0:45',
        tags: ['#HoodieDrop', '#BiigggX'],
      },
    ];

    const ids = [];
    for (const item of items) {
      const id = await ctx.db.insert('media', {
        ...item,
        isPublished: true,
        viewCount: 0,
        createdAt: now,
      });
      ids.push(id);
    }
    return ids;
  },
});
