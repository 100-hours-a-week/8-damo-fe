import { useQuery } from "@tanstack/react-query";
import { getDiningReceiptOcrStatus } from "@/src/lib/api/client/receipt";
import type { ReceiptOcrStatus } from "@/src/types/api/dining";

const RECEIPT_POLLING_INTERVAL_MS = 3 * 1_000;

export function useDiningReceiptStatus(
  groupId: string,
  diningId: string,
  enabled: boolean,
  initialOcrStatus?: ReceiptOcrStatus
) {
  return useQuery({
    queryKey: ["dining", "detail", groupId, diningId, "receipt-ocr-status"],
    queryFn: async () => {
      const response = await getDiningReceiptOcrStatus({ groupId, diningId });
      return response.data;
    },
    enabled,
    initialData: initialOcrStatus,
    refetchInterval: (query) => {
      const status = query.state.data;
      if (status === "SUCCESS" || status === "FAIL") return false;
      return RECEIPT_POLLING_INTERVAL_MS;
    },
    refetchOnWindowFocus: false,
  });
}
