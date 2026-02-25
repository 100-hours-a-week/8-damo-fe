"use client";

import { useCallback, useEffect, useState } from "react";
import type { LocationPermission } from "@/src/types/lightning";

interface UseLightningLocationResult {
  permission: LocationPermission;
  requestPermission: () => void;
}

function getInitialPermission(): LocationPermission{
  if (typeof navigator === "undefined") return "unknown";
  if (!("geolocation" in navigator)) return "denied";
  return "unknown";
}

export function useLightningLocation(): UseLightningLocationResult {
  const [permission, setPermission] = useState<LocationPermission>(
    getInitialPermission
  );

  const updatePermission = useCallback((next: LocationPermission) => {
    setPermission((prev) => (prev === next ? prev : next));
  }, []);

  useEffect(() => {
    if (
      typeof navigator === "undefined" ||
      !navigator.permissions?.query
    ) {
      return;
    }

    let cancelled = false;

    navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        if (cancelled) return;

        if (status.state === "granted") updatePermission("granted");
        if (status.state === "denied") updatePermission("denied");
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [updatePermission]);

  const requestPermission = useCallback(() => {
    if (!("geolocation" in navigator)) {
      updatePermission("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => updatePermission("granted"),
      () => updatePermission("denied")
    );
  }, [updatePermission]);

  return { permission, requestPermission };
}