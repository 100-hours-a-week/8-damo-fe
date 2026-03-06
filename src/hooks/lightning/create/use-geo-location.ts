"use client";

import { useCallback, useEffect, useState } from "react";

export type LocationPermission = "unknown" | "prompt" | "granted" | "denied";

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 600_000,
      maximumAge: 10_000,
    });
  });
}

export function useGeolocation() {
  const [permission, setPermission] = useState<LocationPermission>("unknown");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!("permissions" in navigator)) {
      setIsInitializing(false);
      return;
    }

    let permissionStatus: PermissionStatus | undefined;

    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      permissionStatus = status;

      if (status.state === "granted") {
        setPermission("granted");
      } else if (status.state === "denied") {
        setPermission("denied");
      } else {
          setPermission("prompt");
      }

      setIsInitializing(false);

      status.onchange = () => {
        if (status.state === "granted") {
          setPermission("granted");
        } else if (status.state === "denied") {
          setPermission("denied");
        } else {
          setPermission("prompt");
        }
      };
    }).catch(() => {
      setIsInitializing(false);
    });

    return () => {
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, []);

  const requestLocation = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      setPermission("denied");
      throw new Error("Geolocation not supported");
    }

    try {
      const pos = await getCurrentPosition();
      setPermission("granted");

      return {
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude,
      };
    } catch (e) {
      if (e instanceof GeolocationPositionError && e.code === e.PERMISSION_DENIED) {
        setPermission("denied");
      }
      throw e;
    }
  }, []);

  return {
    permission,
    isInitializing,
    requestLocation,
  };
}
