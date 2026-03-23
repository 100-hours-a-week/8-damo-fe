import "server-only";
import { serverGet } from "./index";
import type { ReceiptOcrStatus } from "@/src/types/api/dining";

export async function getDiningReceiptOcrStatus(params: {
  groupId: string;
  diningId: string;
}): Promise<ReceiptOcrStatus> {
  const { groupId, diningId } = params;

  return serverGet<ReceiptOcrStatus>(
    `/api/v1/groups/${groupId}/dining/${diningId}/receipt-ocr/status`
  );
}
