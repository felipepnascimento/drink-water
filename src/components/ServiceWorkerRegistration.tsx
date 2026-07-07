"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // A caching service worker fights Turbopack's dev chunks (their names
      // change on every rebuild), causing stale-chunk load errors. Actively
      // unregister any SW a previous session may have installed on this
      // origin so `next dev` isn't left in a broken state.
      navigator.serviceWorker?.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      return;
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}
