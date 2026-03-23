import { bffGet, type ApiResponse } from "./index";
import type { ReceiptOcrStatus } from "@/src/types/api/dining";

export async function getDiningReceiptOcrStatus(params: {
  groupId: string;
  diningId: string;
}): Promise<ApiResponse<ReceiptOcrStatus>> {
  const { groupId, diningId } = params;
  return bffGet<ReceiptOcrStatus>(
    `/groups/${groupId}/dining/${diningId}/receipt-ocr/status`
  );
}
