import { useQuery } from "@tanstack/react-query";
import { getDiningAttendanceVote } from "@/src/lib/api/client/dining";

const POLLING_INTERVAL_MS = 5_000;

export function useDiningAttendanceVote(
  groupId: string,
  diningId: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["dining", "detail", groupId, diningId, "attendance-vote"],
    queryFn: async () => {
      const response = await getDiningAttendanceVote({ groupId, diningId });
      return response.data;
    },
    enabled,
    refetchInterval: POLLING_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });
}