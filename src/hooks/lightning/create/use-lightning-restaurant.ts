"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useGeolocation } from "./use-geo-location";
import { useLightningRecommendation } from "./use-lightning-recommendation";

interface Coords {
  longitude: number;
  latitude: number;
}

type LocationRequestStatus = "idle" | "requesting" | "success" | "error";

export function useLightningRestaurant() {
  const { permission, isInitializing, requestLocation } = useGeolocation();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locationRequestStatus, setLocationRequestStatus] =
    useState<LocationRequestStatus>("idle");
  const query = useLightningRecommendation(coords);
  const hasRequestedLocationRef = useRef(false);

  const requestRestaurant = useCallback(async () => {
    if (locationRequestStatus === "requesting") return;

    try {
      setLocationRequestStatus("requesting");

      const location = await requestLocation();
      setCoords(location);
      setLocationRequestStatus("success");
    } catch (error) {
      console.error("requestLocation failed", error);
      setLocationRequestStatus("error");

      if (error instanceof GeolocationPositionError) {
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("위치 권한이 필요합니다.");
          return;
        }
      }

      toast.error("현재 위치를 불러오지 못했습니다.");
    }
  }, [locationRequestStatus, requestLocation]);

  const retryRestaurant = useCallback(() => {
    if (!coords) {
      requestRestaurant();
      return;
    }
    query.refetch();
  }, [coords, query, requestRestaurant]);

  useEffect(() => {
    if (hasRequestedLocationRef.current) return;
    if (!isInitializing && permission !== "denied" && coords === null) {
      hasRequestedLocationRef.current = true;
      queueMicrotask(() => {
        void requestRestaurant();
      });
    }
  }, [isInitializing, permission, coords, requestRestaurant]);

  useEffect(() => {
    if (query.isError) {
      const err = query.error;
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.errorMessage ?? "식당 정보를 불러오지 못했습니다."
        );
      } else {
        toast.error("식당 정보를 불러오지 못했습니다.");
      }
    }
  }, [query.isError, query.error]);

  const isLoadingRestaurant =
    isInitializing ||
    (permission !== "denied" &&
      (locationRequestStatus === "requesting" ||
        (locationRequestStatus === "success" &&
          (query.isPending || query.isFetching))));

  return {
    permission,
    isInitializing,
    restaurant: query.data?.data ?? null,
    isLoadingRestaurant,
    isTimedOut: query.isError,
    requestRestaurant,
    retryRestaurant,
  };
}
