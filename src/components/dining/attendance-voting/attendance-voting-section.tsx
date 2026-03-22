"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/src/components/ui/sonner";
import { voteAttendance } from "@/src/lib/api/client/dining";
import { type AttendanceVoteStatus } from "@/src/types/api/dining";
import { diningAttendanceVoteQueryKey } from "@/src/hooks/dining/use-dining-attendance-vote";
import { AttendanceVoteActions } from "./attendance-vote-action";

interface AttendanceVotingSectionProps {
  progress: {
    totalCount: number;
    voteCount: number;
  };
  myVoteStatus: AttendanceVoteStatus;
}

export function AttendanceVotingSection({
  progress,
  myVoteStatus,
}: AttendanceVotingSectionProps) {
  const params = useParams<{ groupId: string; diningId: string }>();
  const router = useRouter();
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
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: diningAttendanceVoteQueryKey(params.groupId, params.diningId),
        }),
        queryClient.invalidateQueries({
          queryKey: ["dining", "detail", params.groupId, params.diningId, "common"],
        }),
      ]);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.errorMessage ?? "참석 투표에 실패했습니다.")
          : "참석 투표에 실패했습니다.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full rounded-[20px] bg-white p-5">
      <h2 className="mb-4 text-lg font-bold leading-6 text-[#101828]">
        참석 투표
      </h2>
      <AttendanceVoteActions
        myVoteStatus={currentVoteStatus}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <div className="mt-4 flex items-center justify-between border-t border-[#e5e7eb] pt-4">
        <span className="text-sm text-[#4a5565]">투표 참여</span>
        <span className="text-sm font-semibold text-[#101828]">
          {progress.voteCount}/{progress.totalCount}명
        </span>
      </div>
    </section>
  );
}
