"use client";

import { useEffect } from "react";

const VISIT_SESSION_KEY = "portfolio_visit_logged";

export default function VisitTracker() {
  useEffect(() => {
    const visitAlreadyLogged = sessionStorage.getItem(VISIT_SESSION_KEY);

    if (visitAlreadyLogged) {
      return;
    }

    sessionStorage.setItem(VISIT_SESSION_KEY, "1");

    void fetch("/api/analytics/visit", {
      method: "POST",
      cache: "no-store",
      keepalive: true,
    });
  }, []);

  return null;
}
