/**
 * Benji's Store - Stripe Integration
 *
 * This file demonstrates how to use the @convex-dev/stripe component
 * for handling payments and subscriptions with Clerk authentication.
 */

import { action, mutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { StripeSubscriptions } from "@convex-dev/stripe";
import { v } from "convex/values";

const stripeClient = new StripeSubscriptions(components.stripe, {});

// Validate required environment variables
function getAppUrl(): string {
  const url = process.env.APP_URL;
  if (!url) {
    throw new Error(
      "APP_URL environment variable is not set. Add it in your Convex dashboard.",
    );
  }
  return url;
}

// ============================================================================
// CUSTOMER MANAGEMENT (Customer Creation)
// ============================================================================

/**
 * Create or get a Stripe customer for the current user.
 * This ensures every user has a linked Stripe customer.
 */
export const getOrCreateCustomer = action({
  args: {},
  returns: v.object({
    customerId: v.string(),
    isNew: v.boolean(),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await stripeClient.getOrCreateCustomer(ctx, {
      userId: identity.subject,
      email: identity.email,
      name: identity.name,
    });
  },
});

// ============================================================================
// CHECKOUT SESSIONS
// ============================================================================

/**
 * Create a checkout session for a subscription.
 * Automatically creates/links a customer first.
 */
export const createSubscriptionCheckout = action({
  args: {
    priceId: v.string(),
    quantity: v.optional(v.number()),
  },
  returns: v.object({
    sessionId: v.string(),
    url: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const customerResult = await stripeClient.getOrCreateCustomer(ctx, {
      userId: identity.subject,
      email: identity.email,
      name: identity.name,
    });

    return await stripeClient.createCheckoutSession(ctx, {
      priceId: args.priceId,
      customerId: customerResult.customerId,
      mode: "subscription",
      quantity: args.quantity,
      successUrl: `${getAppUrl()}/?success=true`,
      cancelUrl: `${getAppUrl()}/?canceled=true`,
      metadata: {
        userId: identity.subject,
        productType: "subscription",
      },
      subscriptionMetadata: {
        userId: identity.subject,
      },
    });
  },
});

// ============================================================================
// SUBSCRIPTION QUERIES
// ============================================================================

/**
 * Get all subscriptions for the current authenticated user.
 */
export const getUserSubscriptions = query({
  args: {},
  returns: v.array(
    v.object({
      stripeSubscriptionId: v.string(),
      stripeCustomerId: v.string(),
      status: v.string(),
      priceId: v.string(),
      quantity: v.optional(v.number()),
      currentPeriodEnd: v.number(),
      cancelAtPeriodEnd: v.boolean(),
      metadata: v.optional(v.any()),
      userId: v.optional(v.string()),
      orgId: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.runQuery(
      components.stripe.public.listSubscriptionsByUserId,
      { userId: identity.subject },
    );
  },
});

/**
 * Get subscription info by subscription ID.
 */
export const getSubscriptionInfo = query({
  args: {
    subscriptionId: v.string(),
  },
  returns: v.union(
    v.object({
      stripeSubscriptionId: v.string(),
      stripeCustomerId: v.string(),
      status: v.string(),
      priceId: v.string(),
      quantity: v.optional(v.number()),
      currentPeriodEnd: v.number(),
      cancelAtPeriodEnd: v.boolean(),
      metadata: v.optional(v.any()),
      userId: v.optional(v.string()),
      orgId: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.runQuery(components.stripe.public.getSubscription, {
      stripeSubscriptionId: args.subscriptionId,
    });
  },
});

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

/**
 * Cancel a subscription either immediately or at period end.
 */
export const cancelSubscription = action({
  args: {
    subscriptionId: v.string(),
    immediately: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const subscription = await ctx.runQuery(
      components.stripe.public.getSubscription,
      { stripeSubscriptionId: args.subscriptionId },
    );

    if (!subscription || subscription.userId !== identity.subject) {
      throw new Error("Subscription not found or access denied");
    }

    await stripeClient.cancelSubscription(ctx, {
      stripeSubscriptionId: args.subscriptionId,
      cancelAtPeriodEnd: !args.immediately,
    });

    return null;
  },
});

/**
 * Reactivate a subscription that was set to cancel at period end.
 */
export const reactivateSubscription = action({
  args: {
    subscriptionId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const subscription = await ctx.runQuery(
      components.stripe.public.getSubscription,
      { stripeSubscriptionId: args.subscriptionId },
    );

    if (!subscription || subscription.userId !== identity.subject) {
      throw new Error("Subscription not found or access denied");
    }

    if (!subscription.cancelAtPeriodEnd) {
      throw new Error("Subscription is not set to cancel");
    }

    await stripeClient.reactivateSubscription(ctx, {
      stripeSubscriptionId: args.subscriptionId,
    });

    return null;
  },
});

// ============================================================================
// CUSTOMER PORTAL
// ============================================================================

/**
 * Generate a link to the Stripe Customer Portal where users can
 * manage their subscriptions, update payment methods, etc.
 */
export const getCustomerPortalUrl = action({
  args: {},
  returns: v.union(
    v.object({
      url: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const subscriptions = await ctx.runQuery(
      components.stripe.public.listSubscriptionsByUserId,
      { userId: identity.subject },
    );

    if (subscriptions.length > 0) {
      return await stripeClient.createCustomerPortalSession(ctx, {
        customerId: subscriptions[0].stripeCustomerId,
        returnUrl: `${getAppUrl()}/`,
      });
    }

    return null;
  },
});
