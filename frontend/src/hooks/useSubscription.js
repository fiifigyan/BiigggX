import { useConvexAuth, useQuery } from 'convex/react';
import { useAuth } from '@clerk/clerk-react';
// eslint-disable-next-line import/no-unresolved
import { api } from '@convex/api';

/**
 * Single source of truth for subscription state across the app.
 * Uses Clerk's isSignedIn for UI guards and Convex's isAuthenticated
 * for the actual subscription query (which needs a verified JWT).
 */
export function useSubscription() {
  const { isAuthenticated } = useConvexAuth();
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();

  const subscriptions = useQuery(
    api.stripe.getUserSubscriptions,
    isAuthenticated ? {} : 'skip',
  );

  const isSubscribed = subscriptions?.some(
    (s) => s.status === 'active' || s.status === 'trialing',
  ) ?? false;

  // Loading: Clerk hasn't resolved yet, or we're signed in but waiting on the query
  const isLoading = !clerkLoaded || (isSignedIn && isAuthenticated && subscriptions === undefined);

  return {
    isSubscribed,
    isLoading,
    isSignedIn: isSignedIn ?? false,
    isAuthenticated,
  };
}

export default useSubscription;
