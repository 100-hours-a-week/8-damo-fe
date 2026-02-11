"use client"

import { useCallback, useEffect, useRef } from "react";

export function useStableEvent<T extends(...args: any[]) => any>(
  handler?: T
): T {
  const handlerRef = useRef<T | undefined>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  return useCallback(((...args: any[]) => {
    return handlerRef.current?.(...args);
  }) as T, []);
}