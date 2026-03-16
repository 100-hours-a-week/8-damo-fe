"use client";

import { Header } from "@/src/components/layout/header";
import { useUserStore } from "@/src/stores/user-store";
import { EditBasicContainer } from "@/src/components/mypage/edit/basic/edit-basic-container";

export default function EditBasicPage() {
  const user = useUserStore((state) => state.user);

  const initialData = {
    nickname: user?.nickname ?? "",
    gender: user?.gender as "MALE" | "FEMALE" | undefined,
    ageGroup: user?.ageGroup as "TWENTIES" | "THIRTIES" | "FORTIES" | "FIFTIES_PLUS" | undefined,
    imagePath: user?.imagePath ?? "",
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header title="기본 정보 수정" backPath="/mypage" />
      <EditBasicContainer initialData={initialData} />
    </div>
  );
}
