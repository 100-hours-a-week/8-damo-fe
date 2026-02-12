"use client"

import { useCallback, useEffect, useRef } from "react";

export function useStableEvent<T extends (...args: unknown[]) => unknown>(
  handler?: T
): T {
  const handlerRef = useRef<T | undefined>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const stableHandler = useCallback((...args: Parameters<T>) => {
    return handlerRef.current?.(...args);
  }, []);

  return stableHandler as T;
}
