"use client";

import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useUserStore } from "@/src/stores/user-store";
import {
  ProfileCard,
  ProfileCardSkeleton,
  ProfileCardError,
  MenuItem,
} from "@/src/components/mypage";
import { Switch } from "@/src/components/ui/switch";
import { toast } from "@/src/components/ui/sonner";
import { BottomNavigationBar } from "@/src/components/layout";
import { useHandlePushToggle } from "@/src/hooks/firebase/use-handle-push-toggle";
import { deleteMe } from "@/src/lib/api/client/user";
import { logout } from "@/src/lib/api/client/auth";
import type { ApiResponse } from "@/src/lib/api/client/index";

function getApiMessage(payload: unknown): string | null {
  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  if (payload && typeof payload === "object") {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  return null;
}

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading, setUser, setInitialized } = useUserStore();
  const { isPushEnabled, isPushHydrated, isPushLoading, handlePushToggle } =
    useHandlePushToggle();
  const withdrawMutation = useMutation({
    mutationFn: deleteMe,
    onSuccess: async (response) => {
      const responseMessage =
        getApiMessage(response.data) ??
        response.errorMessage ??
        "회원 탈퇴가 완료되었습니다.";

      toast.success(responseMessage);

      await logout();
      setUser(null);
      setInitialized(false);
      router.replace("/login");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const payload = error.response?.data as ApiResponse<unknown> | undefined;
        const responseMessage =
          getApiMessage(payload?.data) ??
          payload?.errorMessage ??
          "회원 탈퇴에 실패했습니다.";

        toast.error(responseMessage);
        return;
      }

      toast.error("회원 탈퇴에 실패했습니다.");
    },
  });

  const handleWithdraw = () => {
    if (withdrawMutation.isPending) {
      return;
    }
    withdrawMutation.mutate();
  };

  return (
    <>
      <main className="flex min-h-screen flex-col pb-24 pt-12">
        {isLoading && <ProfileCardSkeleton />}
        {!isLoading && !user && <ProfileCardError />}
        {!isLoading && user && (
          <ProfileCard
            userId={user.userId}
            nickname={user.nickname ?? ""}
            gender={user.gender ?? ""}
            ageGroup={user.ageGroup ?? ""}
            imagePath={user.imagePath}
          />
        )}

        <nav className="flex flex-col">
          <MenuItem href="/mypage/edit/basic" label="기본 정보 수정" />
          <MenuItem href="/mypage/edit/characteristic" label="개인 특성 수정" />
        </nav>

        <div className="h-2 bg-muted" />

        <nav className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-5">
            <span className="text-xl font-bold text-foreground">푸시 알림</span>
            <Switch
              checked={isPushEnabled}
              disabled={!isPushHydrated || isPushLoading}
              onCheckedChange={handlePushToggle}
              aria-label="푸시 알림 토글"
            />
          </div>
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={withdrawMutation.isPending}
            className="flex items-center justify-between border-b border-border px-5 py-5 disabled:opacity-60"
          >
            <span className="text-xl font-bold text-foreground">
              {withdrawMutation.isPending ? "회원 탈퇴 처리 중..." : "회원 탈퇴"}
            </span>
            <ChevronRight className="size-6 text-muted-foreground" />
          </button>
          <MenuItem href="#" label="리뷰 관리" />
        </nav>
      </main>
      <BottomNavigationBar />
    </>
  );
}
