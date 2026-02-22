import { useQuery } from "@tanstack/react-query";
import { getDiningCommon } from "@/src/lib/api/client/dining";
import type { DiningCommonResponse } from "@/src/types/api/dining";

const POLLING_INTERVAL_MS = 300_000;

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
    refetchInterval: (query) => {
      const status = query.state.data?.diningStatus;
      return status === "CONFIRMED" || status === "COMPLETE"
        ? false
        : POLLING_INTERVAL_MS;
    },
    refetchOnWindowFocus: false,
  });
}