"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getLightningList } from "@/src/lib/api/client/lightning";
import type { LightningTab } from "@/src/types/lightning";

export function useLightningList(tab: LightningTab) {
  return useInfiniteQuery({
    queryKey: ["lightning", "list", tab],
    queryFn: async ({ pageParam }) => {
      const res = await getLightningList(
        tab,
        pageParam as string | undefined
      );
      return res.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchInterval: 10_000,
    refetchOnWindowFocus: true
  });
}
