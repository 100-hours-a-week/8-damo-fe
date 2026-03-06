"use client";

import { useMemo, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/components/ui/sonner";
import { processAuthTestByUserId } from "@/src/lib/api/client/auth";

type LoginTextParams = Record<string, string | string[]> & {
  "user-id"?: string | string[];
};

function normalizeUserId(raw: string | string[] | undefined): string | null {
  if (!raw) return null;

  const value = Array.isArray(raw) ? raw[0] : raw;
  const userId = value.trim();

  return userId.length > 0 ? userId : null;
}

export function LoginTestUserIdContent() {
  const params = useParams<LoginTextParams>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const userId = useMemo(() => normalizeUserId(params?.["user-id"]), [params]);

  const handleAuthTest = () => {
    if (!userId) {
      toast.error("유효한 userId가 필요합니다.");
      return;
    }

    startTransition(async () => {
      try {
        await processAuthTestByUserId(userId);
        router.replace("/");
      } catch {
        toast.error("로그인 테스트에 실패했습니다.");
      }
    });
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-4 py-6">
      <section className="w-full rounded-2xl border border-border bg-card p-5 text-center">
        <h1 className="text-lg font-semibold text-foreground">Login Test</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          선택된 userId로 인증 테스트를 진행합니다.
        </p>
        <p className="mt-3 text-sm font-medium text-foreground">
          userId: {userId ?? "없음"}
        </p>
      </section>

      <Button
        type="button"
        className="w-full"
        onClick={handleAuthTest}
        disabled={isPending || !userId}
      >
        {isPending ? "처리 중..." : "해당 userId로 진입"}
      </Button>
    </main>
  );
}
