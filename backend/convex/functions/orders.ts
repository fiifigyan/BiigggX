import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Place a new order
 */
export const placeOrder = mutation({
  args: {
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
    totalAmount: v.number(),
    currency: v.optional(v.string()),
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
    paymentProvider: v.optional(v.union(v.literal('stripe'), v.literal('paypal'))),
    stripeSessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();

    // Validate inventory and exclusivity for all items
    for (const item of args.items) {
      const merch = await ctx.db.get(item.merchId);
      if (!merch) throw new Error(`Merch item not found: ${item.merchId}`);
      if (!merch.isActive) throw new Error(`Item is no longer available: ${merch.name}`);
      if (merch.inventory < item.quantity) {
        throw new Error(`Insufficient inventory for ${merch.name}. Available: ${merch.inventory}`);
      }
      if (merch.isExclusive && !identity) {
        throw new Error(`${merch.name} is exclusive to BiigggX Pass members. Sign in to purchase.`);
      }
    }

    // Create order (inventory is decremented only after payment is confirmed)
    const orderId = await ctx.db.insert('orders', {
      userId: args.userId,
      guestEmail: args.guestEmail,
      items: args.items,
      status: 'pending',
      totalAmount: args.totalAmount,
      currency: args.currency || 'USD',
      shippingAddress: args.shippingAddress,
      stripeSessionId: args.stripeSessionId,
      paymentInfo: args.paymentProvider
        ? {
            provider: args.paymentProvider,
            sessionId: args.stripeSessionId,
          }
        : undefined,
      createdAt: now,
      updatedAt: now,
    });

    return orderId;
  },
});

/**
 * Update order status (e.g., from Stripe webhook)
 */
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id('orders'),
    status: v.union(
      v.literal('pending'),
      v.literal('paid'),
      v.literal('processing'),
      v.literal('shipped'),
      v.literal('delivered'),
      v.literal('cancelled'),
      v.literal('refunded')
    ),
    trackingNumber: v.optional(v.string()),
    paymentIntentId: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error('Order not found');

    await ctx.db.patch(args.orderId, { status: args.status, updatedAt: Date.now() });
    if (args.trackingNumber) {
      await ctx.db.patch(args.orderId, { trackingNumber: args.trackingNumber });
    }
    if (args.notes) {
      await ctx.db.patch(args.orderId, { notes: args.notes });
    }
    if (args.paymentIntentId && order.paymentInfo) {
      await ctx.db.patch(args.orderId, {
        paymentInfo: { ...order.paymentInfo, paymentIntentId: args.paymentIntentId },
      });
    }
    return { success: true };
  },
});

/**
 * Update order status by Stripe session ID (for webhook handling)
 */
export const updateOrderBySession = mutation({
  args: {
    sessionId: v.string(),
    status: v.union(v.literal('paid'), v.literal('cancelled')),
    paymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query('orders')
      .withIndex('by_session', (q) => q.eq('stripeSessionId', args.sessionId))
      .first();
    if (!order) return { success: false, error: 'Order not found' };

    await ctx.db.patch(order._id, {
      status: args.status,
      updatedAt: Date.now(),
      paymentInfo: order.paymentInfo
        ? { ...order.paymentInfo, paymentIntentId: args.paymentIntentId }
        : undefined,
    });

    // Decrement inventory only after Stripe confirms payment
    if (args.status === 'paid') {
      for (const item of order.items) {
        const merch = await ctx.db.get(item.merchId);
        if (merch) {
          await ctx.db.patch(item.merchId, {
            inventory: Math.max(0, merch.inventory - item.quantity),
          });
        }
      }
    }

    return { success: true, orderId: order._id };
  },
});

/**
 * Get orders for a user
 */
export const getUserOrders = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('orders')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});

/**
 * Get order by ID
 */
export const getOrderById = query({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});
