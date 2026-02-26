import { action } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';

/**
 * Create a Stripe Checkout Session.
 * Called from the frontend when the user clicks "Checkout".
 */
export const createCheckoutSession = action({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Stripe = (await import('stripe') as any).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });

    // Apply 10% discount for active BiigggX Pass members
    const identity = await ctx.auth.getUserIdentity();
    let discountMultiplier = 1;
    if (identity) {
      const subs = await ctx.runQuery(api.stripe.getUserSubscriptions, {});
      const isSubscriber = (subs as { status: string }[]).some(
        (s) => s.status === 'active' || s.status === 'trialing'
      );
      if (isSubscriber) discountMultiplier = 0.9;
    }

    const lineItems = args.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: discountMultiplier < 1 ? `${item.name} — Member 10% Off` : item.name,
          images: item.imageURL ? [item.imageURL] : [],
          metadata: { convex_merch_id: item.merchId },
        },
        unit_amount: Math.round(item.price * 100 * discountMultiplier),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${args.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: args.cancelUrl,
      customer_email: args.customerEmail,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NG', 'GH', 'ZA'],
      },
      metadata: { source: 'biigggx-website' },
    });

    return { sessionId: session.id as string, url: session.url as string };
  },
});

/**
 * Handle incoming Stripe webhook events.
 * Wire this to a Convex HTTP action endpoint.
 */
export const handleStripeWebhook = action({
  args: {
    rawBody: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, args) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Stripe = (await import('stripe') as any).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        args.rawBody,
        args.signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = event.data.object as any;

    switch (event.type) {
      case 'checkout.session.completed': {
        const result = await ctx.runMutation(api.functions.orders.updateOrderBySession, {
          sessionId: data.id,
          status: 'paid',
          paymentIntentId: data.payment_intent,
        });

        // Send order confirmation email
        if (result.success && result.orderId) {
          const order = await ctx.runQuery(api.functions.orders.getOrderById, {
            orderId: result.orderId,
          });
          const customerEmail = order?.guestEmail ?? data.customer_email ?? null;
          if (order && customerEmail) {
            await ctx.runAction(internal.functions.email.sendOrderConfirmationEmail, {
              to: customerEmail,
              orderId: result.orderId,
              items: order.items,
              totalAmount: order.totalAmount,
              currency: order.currency ?? 'USD',
              paymentProvider: 'stripe',
            });
          }
        }
        break;
      }

      case 'checkout.session.expired':
        await ctx.runMutation(api.functions.orders.updateOrderBySession, {
          sessionId: data.id,
          status: 'cancelled',
        });
        break;

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return { received: true, type: event.type as string };
  },
});
