import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexReactClient, ConvexProvider } from 'convex/react';
import App from './App.jsx';
import './styles/index.css';

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || 'https://placeholder.convex.cloud'
);

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

async function init() {
  let AppTree;

  if (clerkKey) {
    // Clerk is configured — use the full auth-aware provider
    const { ClerkProvider, useAuth } = await import('@clerk/clerk-react');
    const { ConvexProviderWithClerk } = await import('convex/react-clerk');

    AppTree = (
      <ClerkProvider publishableKey={clerkKey}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <App />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    );
  } else {
    // Clerk key not set yet — run without auth so the app still loads
    console.warn(
      '[BiigggX] VITE_CLERK_PUBLISHABLE_KEY is not set. ' +
      'Auth features are disabled. Add your key to frontend/.env to enable them.'
    );
    AppTree = (
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>{AppTree}</React.StrictMode>
  );
}

init();
