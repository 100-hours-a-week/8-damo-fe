export function DiningStatusSectionFallback() {
  return (
    <section
      aria-hidden="true"
      className="space-y-5"
    >
      <div className="space-y-2">
        <div className="h-7 w-52 rounded-[6px] bg-[#d1d5dc] animate-pulse" />
        <div className="h-5 w-full max-w-[18.75rem] rounded-[6px] bg-[#e5e7eb] animate-pulse" />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white px-4 pb-4 pt-[17px]">
        <div className="mt-4 space-y-3">
          <div className="flex h-[3.875rem] items-center justify-between rounded-[14px] border border-black/10 px-[13px]">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-[#e5e7eb] animate-pulse" />
              <div className="h-3 w-32 rounded bg-[#e5e7eb] animate-pulse" />
            </div>
            <div className="h-8 w-16 rounded bg-[#e5e7eb] animate-pulse" />
          </div>

          <div className="flex h-[3.875rem] items-center justify-between rounded-[14px] border border-black/10 px-[13px]">
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-[#e5e7eb] animate-pulse" />
              <div className="h-3 w-28 rounded bg-[#e5e7eb] animate-pulse" />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[14px] border border-black/10 px-4 py-4">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-[#e5e7eb] animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-[#e5e7eb] animate-pulse" />
            <div className="h-16 w-16 rounded-[10px] bg-[#e5e7eb] animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
