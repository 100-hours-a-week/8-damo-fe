"use client"
import { DiningCommonResponse } from "@/src/types/api/dining";
import { useDiningAttendanceVote } from "@/src/hooks/dining/use-dining-attendance-vote";
import { AttendanceVotingSection } from "./attendance-voting-section";

interface AttendanceVotingContainerProps {
  groupId: string;
  diningId: string;
  diningCommon: DiningCommonResponse;
}

export function AttendanceVotingContainer({
  groupId,
  diningId,
  diningCommon,
}: AttendanceVotingContainerProps) {

  const { data } = useDiningAttendanceVote(
    groupId,
    diningId,
    true
  );

  if (!data) return null;

  return (
    <AttendanceVotingSection
      progress={{
        totalCount: data.totalGroupMemberCount,
        voteCount: data.completedVoteCount,
      }}
      diningDate={diningCommon.diningDate}
      myVoteStatus={data.attendanceVoteStatus}
    />
  );
}