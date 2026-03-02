"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/src/components/ui/sonner";
import { voteAttendance } from "@/src/lib/api/client/dining";
import { type AttendanceVoteStatus } from "@/src/types/api/dining";
import { diningAttendanceVoteQueryKey } from "@/src/hooks/dining/use-dining-attendance-vote";
import { AttendanceVoteProgress } from "./attendance-vote-progress";
import { AttendanceVotePrompt } from "./attendance-vote-prompt";
import { AttendanceVoteActions } from "./attendance-vote-action";

interface AttendanceVotingSectionProps {
  progress: {
    totalCount: number;
    voteCount: number;
  };
  diningDate: string;
  myVoteStatus: AttendanceVoteStatus;
}

export function AttendanceVotingSection({
  progress,
  diningDate,
  myVoteStatus,
}: AttendanceVotingSectionProps) {
  const params = useParams<{ groupId: string; diningId: string }>();
  const queryClient = useQueryClient();
  const [currentVoteStatus, setCurrentVoteStatus] =
    useState<AttendanceVoteStatus>(myVoteStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (vote: "ATTEND" | "NON_ATTEND") => {
    if (!params?.groupId || !params?.diningId) {
      toast.error("경로 정보를 확인할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await voteAttendance({
        groupId: params.groupId,
        diningId: params.diningId,
        attendanceVoteStatus: vote,
      });

      setCurrentVoteStatus(vote);
      await queryClient.invalidateQueries({
        queryKey: diningAttendanceVoteQueryKey(params.groupId, params.diningId),
      });
    } catch {
      toast.error("참석 투표에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full rounded-[20px] bg-white p-4 sm:p-5">
      <div className="flex flex-col items-center gap-10 sm:gap-[52px]">
        <AttendanceVoteProgress
          totalCount={progress.totalCount}
          voteCount={progress.voteCount} />

        <AttendanceVotePrompt diningDate={diningDate}/>

        <AttendanceVoteActions
          myVoteStatus={currentVoteStatus}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}/>
      </div>
    </section>
  )
}
