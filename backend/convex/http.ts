import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { components, api } from "./_generated/api";
import { registerRoutes } from "@convex-dev/stripe";

const http = httpRouter();

// @convex-dev/stripe component webhook (handles subscription events)
registerRoutes(http, components.stripe, {
  webhookPath: "/stripe/webhook",
});

// Custom webhook for one-time payment checkout sessions
http.route({
  path: "/api/stripe/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature") ?? "";

    try {
      const result = await ctx.runAction(
        api.functions.stripe.handleStripeWebhook,
        { rawBody, signature },
      );
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
