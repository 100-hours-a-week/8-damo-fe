import { Suspense } from "react";
import { LightningPageContent } from "@/src/components/lightning/lightning-page-content";
import { LightningPageFallback } from "@/src/components/lightning/lightning-fallback";
import type { LightningTab } from "@/src/types/lightning";
import {
  getJoinedLightnings,
  getRecruitingLightnings,
} from "@/src/lib/api/server/lightning";

interface PageProps {
  searchParams?: Promise<{ tab?: string }>;
}

const isLightningTab = (value?: string): value is LightningTab =>
  value === "recruiting" || value === "joined";

export default async function LightningPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const activeTab: LightningTab = isLightningTab(resolvedSearchParams?.tab)
    ? resolvedSearchParams.tab
    : "recruiting";

  let items =
    activeTab === "joined"
      ? await getJoinedLightnings()
      : await getRecruitingLightnings();

  items = [];

  return (
    <Suspense fallback={<LightningPageFallback />}>
      <LightningPageContent activeTab={activeTab} items={items} />
    </Suspense>
  );
}
