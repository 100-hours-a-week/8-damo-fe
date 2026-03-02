import { Users, Zap } from "lucide-react";
import { EmptyState } from "@/src/components/ui/empty-state";
import type { LightningTab } from "@/src/types/lightning";

interface LightningEmptyStateProps {
  activeTab: LightningTab;
}

export function LightningEmptyState({ activeTab }: LightningEmptyStateProps) {
  const isJoinedTab = activeTab === "joined";
  const emptyStateTitle = isJoinedTab
    ? "참여한 번개가 아직 없어요 🥲"
    : "모집 중인 번개가 없어요 🔍";

  const emptyStateDescription = isJoinedTab
    ? "마음에 드는 번개에 참여하면 이곳에 모여요."
    : "새로운 번개를 만들어 다른 사람들과 함께해보세요.";

  const EmptyStateIcon = isJoinedTab ? Users : Zap;

  return (
    <EmptyState
      icon={EmptyStateIcon}
      title={emptyStateTitle}
      description={emptyStateDescription}
      className="rounded-2xl bg-white py-14 sm:py-16"
    />
  );
}
