import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLightning } from "@/src/lib/api/client/lightning";

export function useCreateLightning() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLightning,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lightning", "list"],
      });
    },
  });
}