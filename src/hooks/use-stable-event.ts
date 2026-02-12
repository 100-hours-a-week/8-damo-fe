"use client";
import { useCallback, useEffect, useRef } from "react";

type AnyFunction = (...args: never[]) => unknown;

export function useStableEvent<T extends AnyFunction>(
  handler?: T
): T {
  const handlerRef = useRef<T | undefined>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const stableHandler = useCallback(
    (...args: Parameters<T>): ReturnType<T> => {
      return (handlerRef.current as AnyFunction)?.(...args) as ReturnType<T>;
    },
    []
  );

  return stableHandler as T;
}