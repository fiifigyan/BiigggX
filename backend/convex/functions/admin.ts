import { action } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Verify admin password server-side.
 * The actual password is stored in the ADMIN_PASSWORD Convex environment variable
 * (set via `npx convex env set ADMIN_PASSWORD your_password`).
 * It is never sent to or stored on the client.
 */
export const verifyAdminPassword = action({
  args: { password: v.string() },
  handler: async (_ctx, args) => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error(
        'ADMIN_PASSWORD is not configured. ' +
        'Run: npx convex env set ADMIN_PASSWORD your_secure_password'
      );
    }
    if (args.password !== adminPassword) {
      throw new Error('Invalid password.');
    }
    return { success: true };
  },
});
