import { ReceiptInteraction } from "@/src/components/receipt/receipt-interaction";
import { ReceiptLayout } from "@/src/components/receipt/receipt-layout";

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

  return (
    <ReceiptLayout>
      <ReceiptInteraction groupId={groupId} diningId={diningId} />
    </ReceiptLayout>
  );
}
