"use client";

import { useEffect, useState } from "react";

interface UseTypewriterOptions {
  intervalMs?: number;
  enabled?: boolean;
}

export function useTypewriter(
  text: string,
  options: UseTypewriterOptions = {}
): string {
  const { intervalMs = 22, enabled = true } = options;
  const [typedText, setTypedText] = useState(() =>
    enabled ? "" : text
  );

  useEffect(() => {
    if (!enabled || text.length === 0) {
      return;
    }

    let currentLength = 0;
    const timer = setInterval(() => {
      currentLength += 1;
      setTypedText(text.slice(0, currentLength));

      if (currentLength >= text.length) {
        clearInterval(timer);
      }
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [enabled, intervalMs, text]);

  return enabled ? typedText : text;
}

