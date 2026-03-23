import { Header } from "@/src/components/layout";
import type { DiningStatus } from "@/src/types/api/dining";
import { DiningDate } from "./dining-date";
import { DiningStatusBadge } from "./dining-status-badge";

interface DiningHeaderProps {
  diningDate: string;
  diningStatus: DiningStatus;
  onBack?: () => void;
  backPath?: string;
}

export function DiningHeader({
  diningDate,
  diningStatus,
  onBack,
  backPath,
}: DiningHeaderProps) {
  return (
    <Header
      title={<DiningDate date={diningDate} />}
      onBack={onBack}
      backPath={backPath}
      rightElement={<DiningStatusBadge status={diningStatus} />}
    />
  );
}
