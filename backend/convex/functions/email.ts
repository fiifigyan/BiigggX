import { internalAction } from '../_generated/server';
import { v } from 'convex/values';

// ─── HTML Email Template ──────────────────────────────────────────────────────

function buildOrderConfirmationHtml(args: {
  orderId: string;
  items: Array<{ name: string; price: number; quantity: number; size?: string }>;
  totalAmount: number;
  currency: string;
  paymentProvider: string;
}): string {
  const symbol = args.currency === 'GHS' ? '₵' : args.currency === 'NGN' ? '₦' : '$';
  const shortId = args.orderId.slice(-8).toUpperCase();
  const provider = args.paymentProvider === 'paystack' ? 'Paystack' : 'Stripe';
  const year = new Date().getFullYear();

  const itemRows = args.items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #1a1a1a;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">
                ${item.name}
                ${item.size ? `<span style="color:#666;font-size:11px;font-weight:normal;"> · ${item.size}</span>` : ''}
              </td>
              <td align="right" style="color:#E53935;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;white-space:nowrap;">
                ${symbol}${(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style="color:#555;font-family:Arial,sans-serif;font-size:12px;padding-top:3px;">
                Qty: ${item.quantity} &times; ${symbol}${item.price.toFixed(2)}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Order Confirmed — BiigggX</title>
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#000000;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0" border="0">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:36px;text-align:center;">
              <div style="font-size:38px;font-weight:bold;letter-spacing:6px;color:#ffffff;">
                BIIGGG<span style="color:#E53935;">X</span>
              </div>
              <div style="font-size:10px;color:#333;letter-spacing:4px;text-transform:uppercase;margin-top:6px;">
                Biiggg moves. X marks the moment.
              </div>
            </td>
          </tr>

          <!-- Red top bar -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,#E53935,transparent);"></td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background-color:#0a0a0a;border:1px solid #1a1a1a;border-top:none;padding:40px 36px;">

              <!-- Status badge -->
              <div style="text-align:center;margin-bottom:32px;">
                <div style="display:inline-block;background:rgba(229,57,53,0.12);border:1px solid rgba(229,57,53,0.4);padding:7px 20px;margin-bottom:18px;">
                  <span style="color:#E53935;font-size:10px;font-weight:bold;letter-spacing:4px;text-transform:uppercase;">
                    &#10003; Order Confirmed
                  </span>
                </div>
                <div style="font-size:30px;font-weight:bold;letter-spacing:2px;color:#ffffff;line-height:1.2;margin-bottom:10px;">
                  YOUR DROP IS<br/>LOCKED IN.
                </div>
                <div style="font-size:12px;color:#555;letter-spacing:1px;">
                  Order #${shortId} &nbsp;&middot;&nbsp; Paid via ${provider}
                </div>
              </div>

              <!-- Divider -->
              <div style="border-top:1px solid #1a1a1a;margin-bottom:28px;"></div>

              <!-- Items heading -->
              <div style="font-size:10px;color:#444;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">
                What You Dropped On
              </div>

              <!-- Items table -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemRows}
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;border-top:1px solid #E53935;">
                <tr>
                  <td style="padding-top:16px;font-size:10px;color:#555;letter-spacing:3px;text-transform:uppercase;">
                    Total Paid
                  </td>
                  <td align="right" style="padding-top:16px;font-size:28px;font-weight:bold;color:#ffffff;letter-spacing:1px;">
                    ${symbol}${args.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="border-top:1px solid #1a1a1a;margin-top:28px;margin-bottom:28px;"></div>

              <!-- What's next -->
              <div style="font-size:10px;color:#444;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">
                What Happens Next
              </div>
              <div style="font-size:13px;color:#666;line-height:1.8;">
                We're pulling your order together. Once it's packed and shipped you'll get
                a tracking notification. Keep an eye on this inbox — drops don't wait.
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin-top:32px;">
                <a href="https://biigggx.com/orders"
                   style="display:inline-block;background:#E53935;color:#ffffff;font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:14px 32px;">
                  View Your Orders
                </a>
              </div>
            </td>
          </tr>

          <!-- Bottom bar -->
          <tr>
            <td style="height:1px;background:#1a1a1a;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0;text-align:center;">
              <div style="font-size:11px;color:#333;letter-spacing:1px;margin-bottom:6px;">
                Questions? Hit us on socials or reply to this email.
              </div>
              <div style="font-size:10px;color:#222;margin-top:12px;letter-spacing:2px;">
                &copy; ${year} BIIGGGX. ALL RIGHTS TAGGED.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Internal Action ──────────────────────────────────────────────────────────

/**
 * Send an order confirmation email via Resend.
 * This is an internal action — only called from webhook handlers, never directly from the client.
 *
 * Required Convex env vars:
 *   RESEND_API_KEY  — from resend.com
 *   EMAIL_FROM      — verified sender, e.g. orders@biigggx.com  (defaults to that if unset)
 *
 * Set with:
 *   npx convex env set RESEND_API_KEY re_xxx
 *   npx convex env set EMAIL_FROM orders@biigggx.com
 */
export const sendOrderConfirmationEmail = internalAction({
  args: {
    to: v.string(),
    orderId: v.string(),
    items: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        size: v.optional(v.string()),
        imageURL: v.optional(v.string()),
      })
    ),
    totalAmount: v.number(),
    currency: v.string(),
    paymentProvider: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[email] RESEND_API_KEY not set — skipping order confirmation email');
      return { skipped: true };
    }

    const from = process.env.EMAIL_FROM ?? 'orders@biigggx.com';
    const html = buildOrderConfirmationHtml(args);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `BiigggX <${from}>`,
        to: [args.to],
        subject: 'Your Drop Is Locked In — BiigggX Order Confirmed',
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[email] Resend API error:', body);
      throw new Error(`Email send failed (${res.status}): ${body}`);
    }

    const data = await res.json() as { id: string };
    console.log('[email] Order confirmation sent, id:', data.id);
    return { sent: true, emailId: data.id };
  },
});
