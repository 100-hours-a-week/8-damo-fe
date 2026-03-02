import { useQuery } from "@tanstack/react-query";
import { getDiningAttendanceVote } from "@/src/lib/api/client/dining";

export const diningAttendanceVoteQueryKey = (groupId: string, diningId: string) =>
  ["dining", "detail", groupId, diningId, "attendance-vote"] as const;

export function useDiningAttendanceVote(
  groupId: string,
  diningId: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: diningAttendanceVoteQueryKey(groupId, diningId),
    queryFn: async () => {
      const response = await getDiningAttendanceVote({ groupId, diningId });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: true,
  });
}