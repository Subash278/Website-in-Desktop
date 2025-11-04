import * as SentryBrowser from "@sentry/browser";

let initialized = false;

export function initSentry() {
  try {
    const dsn = import.meta.env.VITE_SENTRY_DSN || "";
    if (!dsn) return;
    SentryBrowser.init({
      dsn,
      integrations: [],
      release: import.meta.env.VITE_APP_VERSION || undefined,
    });
    initialized = true;
  } catch (e) {
    // ignore init errors
    // eslint-disable-next-line no-console
    console.warn("Sentry init failed", e);
  }
}

export function isInitialized() {
  return initialized;
}

export function captureException(err: any, ctx?: any) {
  if (!initialized) return;
  // @ts-ignore
  SentryBrowser.captureException(err, { extra: ctx });
}
