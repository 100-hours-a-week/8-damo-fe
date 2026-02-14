"use client";

import { AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/src/components/ui/button";
import { EmptyState } from "@/src/components/ui/empty-state";
import { getLightningDetail } from "@/src/lib/api/client/lightning";
import { LightningDetailPageContent } from "./lightning-detail-page-content";

interface LightningDetailClientProps {
  lightningId: string;
}

export function LightningDetailClient({ lightningId }: LightningDetailClientProps) {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["lightning", "detail", lightningId],
    queryFn: async () => {
      const response = await getLightningDetail(lightningId);
      return response.data;
    },
    staleTime: 10_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isPending) {
    return (
      <div className="mx-auto flex min-h-dvh w-full min-w-[320px] max-w-[430px] flex-col bg-background px-4 pb-8 pt-4">
        <div className="h-12 animate-pulse rounded-2xl bg-[#f1e7dc]" />
        <div className="mt-4 h-52 animate-pulse rounded-2xl bg-[#f1e7dc]" />
        <div className="mt-4 h-44 animate-pulse rounded-2xl bg-[#f1e7dc]" />
        <div className="mt-4 h-32 animate-pulse rounded-2xl bg-[#f1e7dc]" />
        <div className="mt-4 h-44 animate-pulse rounded-2xl bg-[#f1e7dc]" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex min-h-dvh w-full min-w-[320px] max-w-[430px] flex-col bg-background">
        <EmptyState
          icon={AlertTriangle}
          title="상세 정보를 불러오지 못했어요"
          description={error instanceof Error ? error.message : "잠시 후 다시 시도해주세요."}
          action={<Button onClick={() => refetch()}>다시 시도</Button>}
          className="min-h-dvh"
        />
      </div>
    );
  }

  const canParticipate =
    data.lightningStatus === "OPEN" &&
    data.currentParticipants < data.maxParticipants;

  return <LightningDetailPageContent detail={data} canParticipate={canParticipate} />;
}
