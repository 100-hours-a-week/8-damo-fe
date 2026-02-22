import { useQuery } from "@tanstack/react-query";
import { getDiningConfirmed } from "@/src/lib/api/client/dining";

export function useDiningConfirmed(
  groupId: string,
  diningId: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["dining", "detail", groupId, diningId, "confirmed"],
    queryFn: async () => {
      const response = await getDiningConfirmed({ groupId, diningId });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}