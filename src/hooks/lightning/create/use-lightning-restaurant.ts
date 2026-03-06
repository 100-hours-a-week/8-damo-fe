"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useGeolocation } from "./use-geo-location";
import { useLightningRecommendation } from "./use-lightning-recommendation";

interface Coords {
  longitude: number;
  latitude: number;
}

export function useLightningRestaurant() {
  const { permission, isInitializing, requestLocation } = useGeolocation();
  const [coords, setCoords] = useState<Coords | null>(null);
  const query = useLightningRecommendation(coords);
  const { refetch } = query;

  const requestRestaurant = useCallback(async () => {
    try {
      const location = await requestLocation();
      setCoords(location);
    } catch {
      // location denied or failed — permission state handles UI
    }
  }, [requestLocation]);

  const retryRestaurant = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isInitializing && permission === "granted") {
      requestRestaurant();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitializing, permission]);

  useEffect(() => {
    if (query.isError) {
      const err = query.error;
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.errorMessage ?? "식당 정보를 불러오지 못했습니다.");
      } else {
        toast.error("식당 정보를 불러오지 못했습니다.");
      }
    }
  }, [query.isError, query.error]);

  const isLoadingRestaurant =
    isInitializing || (permission === "granted" && (coords === null || query.isFetching));

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