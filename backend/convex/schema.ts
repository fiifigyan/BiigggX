import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // ── Users ──────────────────────────────────────────────────────────────────
  users: defineTable({
    name: v.string(),
    email: v.string(),
    socialHandle: v.optional(v.string()),
    role: v.union(v.literal('customer'), v.literal('admin'), v.literal('collaborator')),
    stripeCustomerId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_role', ['role']),

  // ── Merch ──────────────────────────────────────────────────────────────────
  merch: defineTable({
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
    isActive: v.boolean(),
    isFeatured: v.optional(v.boolean()),
    stripePriceId: v.optional(v.string()),
    stripeProductId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_category', ['category'])
    .index('by_active', ['isActive'])
    .index('by_featured', ['isFeatured']),

  // ── Orders ─────────────────────────────────────────────────────────────────
  orders: defineTable({
    userId: v.optional(v.id('users')),
    guestEmail: v.optional(v.string()),
    items: v.array(
      v.object({
        merchId: v.id('merch'),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        size: v.optional(v.string()),
        imageURL: v.optional(v.string()),
      })
    ),
    status: v.union(
      v.literal('pending'),
      v.literal('paid'),
      v.literal('processing'),
      v.literal('shipped'),
      v.literal('delivered'),
      v.literal('cancelled'),
      v.literal('refunded')
    ),
    totalAmount: v.number(),
    currency: v.string(),
    shippingAddress: v.optional(
      v.object({
        name: v.string(),
        line1: v.string(),
        line2: v.optional(v.string()),
        city: v.string(),
        state: v.optional(v.string()),
        postalCode: v.string(),
        country: v.string(),
      })
    ),
    paymentInfo: v.optional(
      v.object({
        provider: v.union(v.literal('stripe'), v.literal('paypal')),
        sessionId: v.optional(v.string()),
        paymentIntentId: v.optional(v.string()),
        paymentMethodType: v.optional(v.string()),
      })
    ),
    trackingNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_status', ['status'])
    .index('by_created', ['createdAt']),

  // ── Media ──────────────────────────────────────────────────────────────────
  media: defineTable({
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
    isPublished: v.boolean(),
    viewCount: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_platform', ['platform'])
    .index('by_type', ['type'])
    .index('by_published', ['isPublished']),

  // ── Collab Requests ────────────────────────────────────────────────────────
  collabRequests: defineTable({
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
    status: v.union(
      v.literal('new'),
      v.literal('reviewed'),
      v.literal('contacted'),
      v.literal('accepted'),
      v.literal('declined')
    ),
    adminNotes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_created', ['createdAt']),

  // ── Brand Content ──────────────────────────────────────────────────────────
  brandContent: defineTable({
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
    isPublished: v.boolean(),
    sortOrder: v.optional(v.number()),
    imageURL: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_type', ['type'])
    .index('by_published', ['isPublished'])
    .index('by_slug', ['slug']),
});
