"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { EmptyState } from "@/src/components/ui/empty-state";
import { getLightningDetail, joinLightning } from "@/src/lib/api/client/lightning";
import { LightningDetailPageContent } from "./lightning-detail-page-content";

interface LightningDetailClientProps {
  lightningId: string;
}

export function LightningDetailClient({ lightningId }: LightningDetailClientProps) {
  const router = useRouter();

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["lightning", "detail", lightningId],
    queryFn: async () => {
      const response = await getLightningDetail(lightningId);
      return response.data;
    },
    staleTime: 120_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const participateMutation = useMutation({
    mutationFn: async () => joinLightning(lightningId),
    onSuccess: () => {
      toast.success("번개 참가가 완료되었습니다.");
      router.push(`/lightning/${lightningId}`);
    },
    onError: () => {
      toast.error("번개 참가에 실패했습니다. 다시 시도해주세요.");
    },
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

  const handleParticipate = () => {
    if (!canParticipate || participateMutation.isPending) return;
    participateMutation.mutate();
  };

  return (
    <LightningDetailPageContent
      detail={data}
      canParticipate={canParticipate}
      isParticipating={participateMutation.isPending}
      onParticipate={handleParticipate}
    />
  );
}
