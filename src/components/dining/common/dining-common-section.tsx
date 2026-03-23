import type {
  DiningParticipantResponse,
  DiningStatus,
} from "@/src/types/api/dining";
import { DiningHeaderContainer } from "./dining-header-container";
import { DiningParticipantList } from "./dining-participant-list";
import { DiningProgressSteps } from "./dining-progress-steps";

interface DiningCommonSectionProps {
  diningDate: string;
  diningStatus: DiningStatus;
  diningParticipants: DiningParticipantResponse[];
  isGroupLeader: boolean;
  backPath?: string;
  children?: React.ReactNode;
}

export function DiningCommonSection({
  diningDate,
  diningStatus,
  diningParticipants,
  isGroupLeader,
  backPath,
  children,
}: DiningCommonSectionProps) {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background"
      data-is-group-leader={isGroupLeader}
    >
      <DiningHeaderContainer diningDate={diningDate} diningStatus={diningStatus} backPath={backPath} />
      
      <div className="flex flex-col gap-2 px-4 pb-10 sm:px-5">
        <DiningProgressSteps diningStatus={diningStatus} />
        {children}
        <DiningParticipantList participants={diningParticipants} />
      </div>

    </div>
  );
}
