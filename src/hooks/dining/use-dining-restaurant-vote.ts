import { useQuery } from "@tanstack/react-query";
import { getDiningRestaurantVote } from "@/src/lib/api/client/dining";

const POLLING_INTERVAL_MS = 3_000;

export function useDiningRestaurantVote(
  groupId: string,
  diningId: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["dining", "detail", groupId, diningId, "restaurant-vote"],
    queryFn: async () => {
      const response = await getDiningRestaurantVote({ groupId, diningId });
      return response.data;
    },
    enabled,
    refetchInterval: POLLING_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });
}