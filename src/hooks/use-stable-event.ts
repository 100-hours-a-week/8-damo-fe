"use client"

import { useCallback, useEffect, useRef } from "react";

export function useStableEvent<T extends (...args: any[]) => any>(
  handler?: T
): T {
  const handlerRef = useRef<T | undefined>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const stableHandler = useCallback(
    (...args: Parameters<T>): ReturnType<T> | undefined => {
    return handlerRef.current?.(...args);
  }, []);

  return stableHandler as T;
}
