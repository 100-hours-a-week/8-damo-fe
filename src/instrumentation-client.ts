// Client Sentry initialization is deferred to SentryIdleProvider to keep it
// off the critical render path.
export function onRouterTransitionStart() {}
