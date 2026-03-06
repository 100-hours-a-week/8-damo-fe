"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useGeolocation } from "./use-geo-location";
import { useLightningRecommendation } from "./use-lightning-recommendation";
import type { Restaurant } from "@/src/types/lightning";

interface Coords {
  longitude: number;
  latitude: number;
}

export function useLightningRestaurant() {
  const { permission, isInitializing, requestLocation } = useGeolocation();
  const recommendation = useLightningRecommendation();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const locationRef = useRef<Coords | null>(null);
  const isRequestingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const executeRecommendation = useCallback(
    async (coords: Coords) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      isRequestingRef.current = true;
      setIsTimedOut(false);
      setIsLoading(true);

      const timeoutId = setTimeout(() => {
        controller.abort();
        setIsTimedOut(true);
        setIsLoading(false);
        isRequestingRef.current = false;
        toast.error("식당 정보를 불러오는 데 시간이 너무 오래 걸립니다. 다시 시도해주세요.");
      }, 180_000);
      timeoutIdRef.current = timeoutId;

      try {
        const res = await recommendation.mutateAsync({
          longitude: coords.longitude,
          latitude: coords.latitude,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        setRestaurant(res.data);
        setIsLoading(false);
      } catch (err) {
        clearTimeout(timeoutId);

        if (axios.isCancel(err) || (err instanceof Error && err.name === "AbortError") || (axios.isAxiosError(err) && err.code === "ERR_CANCELED")) {
          return;
        }

        if (axios.isAxiosError(err)) {
          toast.error(
            err.response?.data?.errorMessage ?? "식당 정보를 불러오지 못했습니다."
          );
        }
        setIsLoading(false);
      } finally {
        isRequestingRef.current = false;
      }
    },
    [recommendation]
  );

  const requestRestaurant = useCallback(async () => {
    if (isRequestingRef.current) return;

    try {
      const coords = await requestLocation();
      locationRef.current = coords;
      await executeRecommendation(coords);
    } catch {
      setIsLoading(false);
    }
  }, [requestLocation, executeRecommendation]);

  const retryRestaurant = useCallback(async () => {
    if (!locationRef.current || isRequestingRef.current) return;
    await executeRecommendation(locationRef.current);
  }, [executeRecommendation]);

  useEffect(() => {
    if (!isInitializing && permission === "granted" && !isRequestingRef.current) {
      requestRestaurant();
    } else if (!isInitializing && permission !== "granted") {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitializing, permission]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  return {
    permission,
    isInitializing,
    restaurant,
    isLoadingRestaurant: isLoading,
    isTimedOut,
    requestRestaurant,
    retryRestaurant,
  };
}