import { BottomNavigationBar } from "@/src/components/layout";

export function LightningPageFallback() {
  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full min-w-[320px] max-w-[430px] flex-col bg-background px-3 pb-24 pt-4 sm:px-4">
        <h1 className="text-2xl font-bold leading-8 text-[#111111] sm:text-[28px] sm:leading-9">
          번개
        </h1>
        <div className="mt-3 h-12 animate-pulse rounded-2xl bg-[#e8e8ed]" />
        <div className="mt-4 flex flex-col gap-3">
          <div className="h-36 animate-pulse rounded-2xl bg-white" />
          <div className="h-36 animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
      <BottomNavigationBar />
    </>
  );
}