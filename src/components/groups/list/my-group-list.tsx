'use client'

import { GroupSummary } from "@/src/types/groups";
import { GroupCard } from "./group-card";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface MyGroupListProps {
  groupSummaryList?: GroupSummary[];
}

export function MyGroupList({ groupSummaryList = [] }: MyGroupListProps) {
  const router = useRouter();

    if (groupSummaryList.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3 px-4 pb-20 sm:gap-4 sm:px-5 sm:pb-24">
        <div className="col-span-2">
          <EmptyState
            icon={Users}
            description="아직 참여하는 그룹이 없습니다."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-8 px-4 pb-20 sm:gap-4 sm:px-5 sm:pb-24">
      {groupSummaryList.map((groupSummary) => (
        <GroupCard
          key={groupSummary.id}
          groupSummary={groupSummary}
          onClick={() => {
            router.push(`/groups/${groupSummary.id}`);
          }}
        />
      ))}
    </div>
  );
}
