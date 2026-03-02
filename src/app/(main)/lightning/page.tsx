import { Suspense } from "react";
import { LightningPageContent, LightningPageFallback } from "@/src/components/lightning";
import type { LightningTab } from "@/src/types/lightning";

interface PageProps {
  searchParams?: Promise<{ tab?: string }>;
}

const isLightningTab = (value?: string): value is LightningTab =>
  value === "joined" || value === "available";

export default async function LightningPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const activeTab: LightningTab = isLightningTab(resolvedSearchParams?.tab)
    ? resolvedSearchParams.tab
    : "joined";

  return (
    <Suspense fallback={<LightningPageFallback />}>
      <LightningPageContent activeTab={activeTab} />
    </Suspense>
  );
}
