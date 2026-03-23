import { useQuery } from "@tanstack/react-query";
import { getDiningCommon } from "@/src/lib/api/client/dining";
import type { DiningCommonResponse } from "@/src/types/api/dining";

export function useDiningCommon(
  groupId: string,
  diningId: string,
  initialData: DiningCommonResponse
) {
  return useQuery({
    queryKey: ["dining", "detail", groupId, diningId, "common"],
    queryFn: async () => {
      const response = await getDiningCommon({ groupId, diningId });
      return response.data;
    },
    initialData,
    staleTime: 3 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}