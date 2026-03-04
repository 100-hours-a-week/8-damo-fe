import { SearchX } from "lucide-react";
import { EmptyState } from "@/src/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-10 top-10 size-40 rounded-full bg-primary/12 blur-2xl" />
        <div className="absolute -right-8 top-28 size-36 rounded-full bg-accent/20 blur-2xl" />
        <div className="absolute bottom-20 left-1/2 size-56 -translate-x-1/2 rounded-full bg-secondary/25 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col items-center justify-center px-4 py-8">
        <p
          className="pointer-events-none absolute top-[16%] text-[96px] font-black leading-none tracking-[-0.06em] text-primary sm:text-[112px]"
          aria-hidden="true"
        >
          404
        </p>

        <div className="w-full rounded-3xl bg-card/70 p-1 shadow-lg backdrop-blur-sm">
          <div className="rounded-[1.3rem] bg-background/95">
            <EmptyState
              icon={SearchX}
              title="앗, 이 페이지는 찾을 수 없어요 🧭"
              description={
                "요청하신 페이지를 찾을 수 없어요."
              }
              className="px-5 py-10 sm:py-12 whitespace-pre-line"
            />

            <div className="sr-only" role="alert">
              페이지를 찾을 수 없습니다. 뒤로 가기 또는 홈으로 이동을 선택하세요.
            </div>
          </div>
        </div>
      </section>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-10 top-10 size-40 rounded-full bg-primary/12 blur-2xl" />
        <div className="absolute -right-8 top-28 size-36 rounded-full bg-accent/20 blur-2xl" />
        <div className="absolute bottom-20 left-1/2 size-56 -translate-x-1/2 rounded-full bg-secondary/25 blur-3xl" />
      </div>

    </main>
  );
}