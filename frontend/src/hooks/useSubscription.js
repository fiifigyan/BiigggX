import { useConvexAuth, useQuery } from 'convex/react';
import { useAuth } from '@clerk/clerk-react';
// eslint-disable-next-line import/no-unresolved
import { api } from '@convex/api';

/**
 * Single source of truth for subscription state across the app.
 * Checks both Stripe and Paystack subscriptions so either payment
 * method unlocks member perks.
 */
export function useSubscription() {
  const { isAuthenticated } = useConvexAuth();
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();

  const skip = isAuthenticated ? {} : 'skip';

  const stripeSubscriptions = useQuery(api.stripe.getUserSubscriptions, skip);
  const paystackSubscriptions = useQuery(api.functions.paystack.getUserPaystackSubscriptions, skip);

  const isSubscribedStripe =
    stripeSubscriptions?.some((s) => s.status === 'active' || s.status === 'trialing') ?? false;

  // Stripe subscription is active but the user has already cancelled it (runs to end of period)
  const stripeIsCancelling =
    isSubscribedStripe &&
    stripeSubscriptions.every(
      (s) => (s.status === 'active' || s.status === 'trialing') && s.cancelAtPeriodEnd
    );

  const isSubscribedPaystack =
    paystackSubscriptions?.some((s) => s.status === 'active') ?? false;

  const isSubscribed = isSubscribedStripe || isSubscribedPaystack;

  // Priority: committed Stripe > Paystack > cancelling Stripe (still active for perks,
  // but we prefer Paystack for management since the user already left Stripe)
  const stripeActiveAndCommitted = isSubscribedStripe && !stripeIsCancelling;
  const subscriptionProvider = stripeActiveAndCommitted
    ? 'stripe'
    : isSubscribedPaystack
      ? 'paystack'
      : isSubscribedStripe
        ? 'stripe'   // cancelling but no Paystack — still manage via Stripe portal
        : null;

  const isLoading =
    !clerkLoaded ||
    (isSignedIn && isAuthenticated && (
      stripeSubscriptions === undefined || paystackSubscriptions === undefined
    ));

  return {
    isSubscribed,
    isLoading,
    isSignedIn: isSignedIn ?? false,
    isAuthenticated,
    subscriptionProvider,
  };
}

export default useSubscription;