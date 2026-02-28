"use client";

import { useState } from "react";
import { useUserStore } from "@/src/stores/user-store";
import {
  ProfileCard,
  ProfileCardSkeleton,
  ProfileCardError,
  MenuItem,
} from "@/src/components/mypage";
import { Switch } from "@/src/components/ui/switch";
import { BottomNavigationBar } from "@/src/components/layout";

export default function MyPage() {
  const { user, isLoading } = useUserStore();
  const [isPushNotificationEnabled, setIsPushNotificationEnabled] =
    useState(false);

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
              checked={isPushNotificationEnabled}
              onCheckedChange={setIsPushNotificationEnabled}
              aria-label="푸시 알림 토글"
            />
          </div>
          <MenuItem href="#" label="회원 탈퇴" />
          <MenuItem href="#" label="리뷰 관리" />
        </nav>
      </main>
      <BottomNavigationBar />
    </>
  );
}
