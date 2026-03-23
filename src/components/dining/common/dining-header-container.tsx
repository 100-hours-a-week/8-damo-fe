import type { DiningStatus } from "@/src/types/api/dining";
import { DiningHeader } from "./dining-header";

interface DiningHeaderContainerProps {
  diningDate: string;
  diningStatus: DiningStatus;
  onBack?: () => void;
  backPath?: string;
}

export function DiningHeaderContainer({
  diningDate,
  diningStatus,
  onBack,
  backPath,
}: DiningHeaderContainerProps) {
  return (
    <DiningHeader
      diningDate={diningDate}
      diningStatus={diningStatus}
      onBack={onBack}
      backPath={backPath}
    />
  );
}
