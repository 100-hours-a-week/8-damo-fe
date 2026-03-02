"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { LightningCard } from "./lightning-card";
import { LightningEmptyState } from "./lightning-empty-state";
import { useRouter } from "next/navigation";
import { BottomNavigationBar, Header } from "@/src/components/layout";
import { Button } from "@/src/components/ui/button";
import { SegmentedTabs } from "@/src/components/ui/segmented-tabs";
import type { LightningTab } from "@/src/types/lightning";
import { useLightningList } from "@/src/hooks/lightning/use-lightning-list";

interface LightningPageContentProps {
  activeTab: LightningTab;
}

const TAB_OPTIONS: { value: LightningTab; label: string }[] = [
  { value: "joined", label: "내가 참여한 번개" },
  { value: "available", label: "모집 중 번개" },
];

export function LightningPageContent({ activeTab }: LightningPageContentProps) {
  const router = useRouter();
  const isJoinedTab = activeTab === "joined";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useLightningList(activeTab);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  const { ref: bottomRef, inView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <Header title={"번개 모임"} showBackButton={false}/>
      <main className="mx-auto flex min-h-dvh w-full min-w-[320px] max-w-[430px] flex-col bg-background px-3 pb-24 sm:px-4">
        <SegmentedTabs
          tabs={TAB_OPTIONS}
          value={activeTab}
          onChange={(value) =>
            router.push(`/lightning?tab=${value as LightningTab}`)
          }
          className="mt-3 rounded-2xl bg-[#e8e8ed] p-1"
        />

        <section className="mt-4 flex flex-col gap-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="size-6 animate-spin rounded-full border-2 border-[#ff8d28] border-t-transparent" />
            </div>
          ) : items.length > 0 ? (
            items.map((item) => (
              <LightningCard
                key={item.id}
                item={item}
                href={
                  isJoinedTab
                    ? `/lightning/${item.id}`
                    : `/lightning/details/${item.id}` 
                }
              />
            ))
          ) : (
            <LightningEmptyState activeTab={activeTab} />
          )}
        </section>

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="size-6 animate-spin rounded-full border-2 border-[#ff8d28] border-t-transparent" />
          </div>
        )}

        <div ref={bottomRef} className="h-1" />
      </main>
      <div className="pointer-events-none fixed bottom-20 left-1/2 w-full max-w-[430px] -translate-x-1/2 px-4">
        <div className="flex justify-end">
          <Button
            asChild
            size="icon-lg"
            className="pointer-events-auto size-14 rounded-full bg-[#ff8d28] text-white shadow-lg hover:bg-[#ff8d28]/90"
          >
            <Link href="/lightning/create" aria-label="번개 생성하기">
              <Plus className="size-6" />
            </Link>
          </Button>
        </div>
      </div>
      <BottomNavigationBar />
    </>
  );
}
