import { SectionCard } from "@/src/components/ui/section-card";

export function RecommendedRestaurantLoading() {
  return (
    <section className="space-y-3" aria-live="polite" aria-busy="true">
      <h2 className="text-sm font-semibold text-[#444444]">추천 식당</h2>

      <SectionCard as="article" className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
          </div>

          <div className="h-6 w-16 shrink-0 animate-pulse rounded-full bg-muted" />
        </div>

        <div className="rounded-xl bg-[#fff8f1] px-3 py-2 text-sm text-[#8a5a2b]">
          주변 식당을 찾는 중입니다.
        </div>
      </SectionCard>

      <div className="overflow-hidden rounded-2xl border border-[#d1d1d6] bg-white">
        <div className="h-52 w-full animate-pulse bg-muted" />
      </div>
    </section>
  );
}
