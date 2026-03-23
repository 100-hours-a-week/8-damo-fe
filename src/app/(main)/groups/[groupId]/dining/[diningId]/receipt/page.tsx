import { ReceiptInteraction } from "@/src/components/receipt/receipt-interaction";
import { ReceiptLayout } from "@/src/components/receipt/receipt-layout";
import { getDiningReceiptOcrStatus } from "@/src/lib/api/server/receipt";
import type { ReceiptOcrStatus } from "@/src/types/api/dining";

interface DiningReceiptPageProps {
  params: Promise<{
    groupId: string;
    diningId: string;
  }>;
}

export default async function DiningReceiptPage({
  params,
}: DiningReceiptPageProps) {
  const { groupId, diningId } = await params;
  let initialReceiptOcrStatus: ReceiptOcrStatus = null;

  try {
    const receiptStatus = await getDiningReceiptOcrStatus({
      groupId,
      diningId,
    });
    initialReceiptOcrStatus = receiptStatus;
  } catch {
    // Keep the upload flow usable even if the initial OCR status lookup fails.
    initialReceiptOcrStatus = null;
  }

  return (
    <ReceiptLayout backPath={`/groups/${groupId}/dining/${diningId}`}>
      <ReceiptInteraction
        groupId={groupId}
        diningId={diningId}
        initialReceiptOcrStatus={initialReceiptOcrStatus}
      />
    </ReceiptLayout>
  );
}
