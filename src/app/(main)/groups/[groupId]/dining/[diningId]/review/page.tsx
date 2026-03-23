import { DiningReviewPageContent } from "@/src/components/dining/review/dining-review-page-content";

interface DiningReviewPageProps {
  params: Promise<{
    groupId: string;
    diningId: string;
  }>;
}

export default async function DiningReviewPage({ params }: DiningReviewPageProps) {
  const { groupId, diningId } = await params;

  return <DiningReviewPageContent groupId={groupId} diningId={diningId} />;
}
