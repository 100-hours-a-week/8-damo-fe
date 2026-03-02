import { useQuery } from "@tanstack/react-query";
import { getDiningRestaurantVote } from "@/src/lib/api/client/dining";

export const diningRestaurantVoteQueryKey = (groupId: string, diningId: string) =>
  ["dining", "detail", groupId, diningId, "restaurant-vote"] as const;

export function useDiningRestaurantVote(
  groupId: string,
  diningId: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: diningRestaurantVoteQueryKey(groupId, diningId),
    queryFn: async () => {
      const response = await getDiningRestaurantVote({ groupId, diningId });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: true,
  });
}