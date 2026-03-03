'use client'

import { useEffect, useRef } from "react";
import { GroupCard } from "./group-card";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMyGroupList } from "@/src/hooks/groups/use-my-group-list";

export function MyGroupList() {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMyGroupList();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "50%", threshold: 0.3 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const groups = data?.pages.flatMap((page) => page.items) ?? [];

  if (groups.length === 0) {
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
      {groups.map((groupSummary) => (
        <GroupCard
          key={groupSummary.id}
          groupSummary={groupSummary}
          onClick={() => {
            router.push(`/groups/${groupSummary.id}`);
          }}
        />
      ))}
      <div ref={sentinelRef} className="col-span-2 h-4" />
    </div>
  );
}
