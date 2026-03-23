import { STATUS_BADGE_CONFIG } from "@/src/constants/dining-status-badge";
import { Badge } from "@/src/components/ui/badge";
import type { DiningStatus } from "@/src/types/api/dining";

interface DiningStatusBadgeProps {
  status: DiningStatus;
}

export function DiningStatusBadge({ status }: DiningStatusBadgeProps) {
  const badgeConfig = STATUS_BADGE_CONFIG[status];

  return (
    <Badge variant={badgeConfig.variant} size="dining">
      {badgeConfig.label}
    </Badge>
  );
}
