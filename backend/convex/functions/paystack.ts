import { action, mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Paystack amounts are always in the smallest currency unit:
 *   GHS → pesewas  (1 GHS = 100 pesewas)
 *   NGN → kobo     (1 NGN = 100 kobo)
 *   USD → cents    (1 USD = 100 cents)
 *
 * PAYSTACK_CURRENCY defaults to 'GHS'.
 * PAYSTACK_USD_RATE is the exchange rate from site price (USD) to local currency.
 *   e.g. if 1 USD = 15.5 GHS, set PAYSTACK_USD_RATE=15.5
 *   Leave unset (or set to 1) if your Paystack account is set to USD.
 */
function toPaystackAmount(usdPrice: number): number {
  const rate = parseFloat(process.env.PAYSTACK_USD_RATE || '1');
  return Math.round(usdPrice * rate * 100);
}

async function isActiveSubscriber(ctx: { runQuery: Function }, identity: { subject: string; email?: string } | null): Promise<boolean> {
  if (!identity) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paystackSubs = (await ctx.runQuery(api.functions.paystack.getUserPaystackSubscriptions, {})) as any[];
  if (paystackSubs.some((s) => s.status === 'active')) return true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stripeSubs = (await ctx.runQuery(api.stripe.getUserSubscriptions, {})) as any[];
  return stripeSubs.some((s) => s.status === 'active' || s.status === 'trialing');
}

// ─── One-time checkout ─────────────────────────────────────────────────────────

/**
 * Initialize a Paystack transaction for merch checkout.
 * Returns the authorization_url to redirect the customer to.
 */
export const createPaystackCheckout = action({
  args: {
    items: v.array(
      v.object({
        merchId: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        imageURL: v.optional(v.string()),
      })
    ),
    successUrl: v.string(),
    cancelUrl: v.string(),
    customerEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // Apply 10% member discount
    let discountMultiplier = 1;
    if (identity && (await isActiveSubscriber(ctx, identity))) {
      discountMultiplier = 0.9;
    }

    const totalUSD = args.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const amount = toPaystackAmount(totalUSD * discountMultiplier);
    const currency = process.env.PAYSTACK_CURRENCY || 'GHS';

    const email = args.customerEmail ?? identity?.email;
    if (!email) throw new Error('Customer email is required for Paystack checkout');

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        currency,
        callback_url: `${args.successUrl}?provider=paystack`,
        metadata: {
          source: 'biigggx-website',
          cancel_action: args.cancelUrl,
          items: args.items.map((i) => ({ id: i.merchId, name: i.name, qty: i.quantity })),
          ...(discountMultiplier < 1 && {
            custom_fields: [{
              display_name: 'Member Discount',
              variable_name: 'member_discount',
              value: '10% off applied',
            }],
          }),
        },
      }),
    });

    const data = await res.json();
    if (!data.status) throw new Error(data.message ?? 'Paystack initialization failed');

    return {
      reference: data.data.reference as string,
      url: data.data.authorization_url as string,
    };
  },
});

// ─── Subscriptions ─────────────────────────────────────────────────────────────

/**
 * Initialize a Paystack subscription checkout for the BiigggX Pass.
 * Plan codes are read from Convex env vars:
 *   PAYSTACK_MONTHLY_PLAN_CODE  e.g. PLN_xxxxxxxxx
 *   PAYSTACK_ANNUAL_PLAN_CODE   e.g. PLN_xxxxxxxxx
 *
 * Create plans in your Paystack Dashboard → Products → Plans.
 */
export const createPaystackSubscriptionCheckout = action({
  args: {
    billing: v.union(v.literal('monthly'), v.literal('annual')),
    successUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Must be signed in to subscribe');

    const email = identity.email;
    if (!email) throw new Error('Email is required to subscribe');

    const planCode =
      args.billing === 'annual'
        ? process.env.PAYSTACK_ANNUAL_PLAN_CODE
        : process.env.PAYSTACK_MONTHLY_PLAN_CODE;

    if (!planCode) {
      throw new Error(
        `PAYSTACK_${args.billing.toUpperCase()}_PLAN_CODE is not set. ` +
        'Create a plan in your Paystack Dashboard → Products → Plans, then add the plan code to your Convex environment variables.'
      );
    }

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        plan: planCode,
        callback_url: `${args.successUrl}?provider=paystack&type=subscription`,
        metadata: {
          source: 'biigggx-pass',
          convex_user_subject: identity.subject,
        },
      }),
    });

    const data = await res.json();
    if (!data.status) throw new Error(data.message ?? 'Paystack subscription initialization failed');

    return {
      reference: data.data.reference as string,
      url: data.data.authorization_url as string,
    };
  },
});

// ─── Webhook ───────────────────────────────────────────────────────────────────

/**
 * Verify and process incoming Paystack webhook events.
 * Signature: HMAC-SHA512 of raw body with PAYSTACK_SECRET_KEY.
 * Header key: x-paystack-signature
 */
export const handlePaystackWebhook = action({
  args: {
    rawBody: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify HMAC-SHA512 signature using Web Crypto API (available in Convex runtime)
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(process.env.PAYSTACK_SECRET_KEY ?? ''),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    );
    const sigBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(args.rawBody));
    const hash = Array.from(new Uint8Array(sigBytes))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    if (hash !== args.signature) {
      throw new Error('Invalid Paystack webhook signature');
    }

    const event = JSON.parse(args.rawBody);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = event.data as any;

    switch (event.event) {
      case 'charge.success': {
        // One-time merch purchase — update pending order to paid
        if (data.metadata?.source === 'biigggx-website') {
          const result = await ctx.runMutation(api.functions.orders.updateOrderByPaystackRef, {
            reference: data.reference,
            status: 'paid',
          });

          // Send order confirmation email
          if (result.success && result.orderId) {
            const order = await ctx.runQuery(api.functions.orders.getOrderById, {
              orderId: result.orderId,
            });
            const customerEmail =
              order?.guestEmail ?? data.customer?.email ?? null;
            if (order && customerEmail) {
              await ctx.runAction(internal.functions.email.sendOrderConfirmationEmail, {
                to: customerEmail,
                orderId: result.orderId,
                items: order.items,
                totalAmount: order.totalAmount,
                currency: order.currency ?? 'GHS',
                paymentProvider: 'paystack',
              });
            }
          }
        }
        break;
      }

      case 'subscription.create': {
        // New subscription created after first payment
        await ctx.runMutation(api.functions.paystack.upsertPaystackSubscription, {
          email: data.customer.email,
          subscriptionCode: data.subscription_code,
          customerCode: data.customer.customer_code,
          planCode: data.plan.plan_code,
          status: 'active',
        });
        break;
      }

      case 'invoice.payment_success': {
        // Recurring subscription payment succeeded
        if (data.subscription) {
          await ctx.runMutation(api.functions.paystack.upsertPaystackSubscription, {
            email: data.customer.email,
            subscriptionCode: data.subscription.subscription_code,
            customerCode: data.customer.customer_code,
            planCode: data.subscription.plan.plan_code,
            status: 'active',
          });
        }
        break;
      }

      case 'subscription.disable':
      case 'subscription.not_renew': {
        if (data.subscription_code) {
          await ctx.runMutation(api.functions.paystack.updatePaystackSubscriptionStatus, {
            subscriptionCode: data.subscription_code,
            status: event.event === 'subscription.disable' ? 'cancelled' : 'non-renewing',
          });
        }
        break;
      }

      default:
        console.log(`Unhandled Paystack event: ${event.event}`);
    }

    return { received: true, event: event.event as string };
  },
});

// ─── Mutations ─────────────────────────────────────────────────────────────────

export const upsertPaystackSubscription = mutation({
  args: {
    email: v.string(),
    subscriptionCode: v.string(),
    customerCode: v.string(),
    planCode: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('paystackSubscriptions')
      .withIndex('by_subscription_code', (q) => q.eq('subscriptionCode', args.subscriptionCode))
      .first();

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, { status: args.status, updatedAt: now });
    } else {
      await ctx.db.insert('paystackSubscriptions', {
        userId: user?._id,
        email: args.email,
        subscriptionCode: args.subscriptionCode,
        customerCode: args.customerCode,
        planCode: args.planCode,
        status: args.status,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const updatePaystackSubscriptionStatus = mutation({
  args: { subscriptionCode: v.string(), status: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('paystackSubscriptions')
      .withIndex('by_subscription_code', (q) => q.eq('subscriptionCode', args.subscriptionCode))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { status: args.status, updatedAt: Date.now() });
    }
  },
});

// ─── Queries ───────────────────────────────────────────────────────────────────

/**
 * Get the current user's Paystack subscriptions.
 * Checks by userId first, falls back to email match.
 */
export const getUserPaystackSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email ?? ''))
      .first();

    if (user) {
      const byUser = await ctx.db
        .query('paystackSubscriptions')
        .withIndex('by_user', (q) => q.eq('userId', user._id))
        .collect();
      if (byUser.length > 0) return byUser;
    }

    if (identity.email) {
      return await ctx.db
        .query('paystackSubscriptions')
        .withIndex('by_email', (q) => q.eq('email', identity.email!))
        .collect();
    }

    return [];
  },
});
