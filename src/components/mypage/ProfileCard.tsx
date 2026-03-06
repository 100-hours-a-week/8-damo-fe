"use client";

import { Avatar } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { PROFILE_FALLBACK_IMAGE } from "@/src/constants/image";
import { GENDER_LABEL, AGE_GROUP_LABEL } from "@/src/constants/user";
import { getProfileImageUrl } from "@/src/lib/profile-image";
import { LogOut } from "lucide-react";
import { logout } from "@/src/lib/api/client/auth";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/stores/user-store";

interface ProfileCardProps {
  userId: string;
  nickname: string;
  gender: string;
  ageGroup: string;
  imagePath: string | null;
}

export function ProfileCard({
  userId,
  nickname,
  gender,
  ageGroup,
  imagePath,
}: ProfileCardProps) {
  const { setUser, setInitialized } = useUserStore();

  const imageUrl = getProfileImageUrl(userId, imagePath);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    setUser(null);
    setInitialized(false);
  };

  return (
    <div className="relative flex items-center gap-4 px-5 py-6">
      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="absolute right-5 top-6 p-1"
        aria-label="로그아웃"
      >
        <LogOut className="size-6 text-[#bfbfbf]" />
      </button>

      {/* 프로필 이미지 */}
      <Avatar
        src={imageUrl}
        alt={nickname}
        fallbackUrl={PROFILE_FALLBACK_IMAGE}
        size="xl"
      />

      {/* 프로필 정보 */}
      <div className="flex flex-col gap-2">
        <span className="text-[24px] font-bold text-foreground sm:text-[28px] md:text-[32px]">
          {nickname}
        </span>
        <div className="flex gap-2">
          {gender && (
            <Badge variant="diningAttendance" size="sm">
              {GENDER_LABEL[gender] ?? gender}
            </Badge>
          )}
          {ageGroup && (
            <Badge variant="diningAttendance" size="sm">
              {AGE_GROUP_LABEL[ageGroup] ?? ageGroup}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
