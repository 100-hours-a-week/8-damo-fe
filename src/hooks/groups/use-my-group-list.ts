"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyGroups } from "@/src/lib/api/client/groups";

export function useMyGroupList() {
  return useInfiniteQuery({
    queryKey: ["groups", "my"],
    queryFn: async ({ pageParam }) => {
      const res = await getMyGroups({ lastGroupId: pageParam as string | undefined });
      return res.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 60_000,
    refetchOnWindowFocus: true
  });
}
