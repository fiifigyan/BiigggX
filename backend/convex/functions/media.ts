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
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { isPublished, ...rest } = args;
    return await ctx.db.insert('media', {
      ...rest,
      isPublished: isPublished ?? true,
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

// ─── Admin functions ───────────────────────────────────────────────────────────

/**
 * Get all media including unpublished (admin only)
 */
export const getAllMedia = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('media').order('desc').collect();
  },
});

/**
 * Update a media item (admin)
 */
export const updateMedia = mutation({
  args: {
    id: v.id('media'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
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
    url: v.optional(v.string()),
    thumbnailURL: v.optional(v.string()),
    embedId: v.optional(v.string()),
    duration: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
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
 * Delete a media item (admin)
 */
export const deleteMedia = mutation({
  args: { id: v.id('media') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/**
 * Generate a Convex Storage upload URL for media files (video or image)
 */
export const generateMediaUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Resolve a storageId to a permanent CDN URL (used client-side before saving)
 */
export const resolveStorageUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.storage.getUrl(args.storageId as Id<'_storage'>);
  },
});
