"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __DAMO_SENTRY_IDLE_INIT__?: boolean;
  }
}

function runWhenIdle(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const browserWindow = window;

  if ("requestIdleCallback" in browserWindow) {
    const idleId = browserWindow.requestIdleCallback(callback, { timeout: 3000 });

    return () => browserWindow.cancelIdleCallback(idleId);
  }

  const timeoutId = globalThis.setTimeout(callback, 1500);

  return () => globalThis.clearTimeout(timeoutId);
}

export function SentryIdleProvider() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.__DAMO_SENTRY_IDLE_INIT__) {
      return;
    }

    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

    if (!dsn) {
      return;
    }

    const cancelIdleTask = runWhenIdle(() => {
      void import("@sentry/nextjs").then((Sentry) => {
        if (window.__DAMO_SENTRY_IDLE_INIT__) {
          return;
        }

        Sentry.init({
          dsn,
          integrations: [Sentry.replayIntegration()],
          tracesSampleRate: 1,
          enableLogs: true,
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1,
          sendDefaultPii: true,
        });

        window.__DAMO_SENTRY_IDLE_INIT__ = true;
      });
    });

    return cancelIdleTask;
  }, []);

  return null;
}
