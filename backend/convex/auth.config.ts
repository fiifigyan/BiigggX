export default {
  providers: [
    {
      // Set CLERK_JWT_ISSUER_DOMAIN in your Convex dashboard env vars.
      // It looks like: https://your-app.clerk.accounts.dev
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN ?? "",
      applicationID: "convex",
    },
  ],
};
